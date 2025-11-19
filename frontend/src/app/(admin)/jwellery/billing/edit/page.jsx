"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

// ------------------------------
// Helpers
// ------------------------------
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
  return null;
};

const n = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

// one product row -> computed values (ported from your create logic)
function computeLine(line) {
  // normalize
  const pcs = n(line.qty);
  const rate = n(line.rate);
  const grossWeight = n(line.gross_weight);
  let netWeight = n(line.net_weight);
  const ad_wgt = n(line.ad_wgt);
  const makingPercent = n(line.making); // %
  const makingInRs = n(line.makingInRs);
  const making_dsc = n(line.making_dsc); // %
  const making_gst_percentage =
    line.making_gst_percentage === "" ? null : n(line.making_gst_percentage); // %
  const tax_rate = n(line.tax_rate); // %
  const wst = n(line.wastageCharge);
  const hall = n(line.hallmarkCharge);
  const other = n(line.otherCharge);
  const stoneW = n(line.stone_weight);
  const stoneV = n(line.stone_value);
  const diamondW = n(line.diamondDetails);
  const diamondV = n(line.diamondValue);
  const mrp = n(line.fixed_amt); // treat as MRP if > 0

  // Adjust netWeight if ad_wgt is provided and <= netWeight (like in your form code)
  if (ad_wgt > 0 && ad_wgt <= netWeight) {
    netWeight = netWeight - ad_wgt;
  }

  // making on actual weight
  const makingPerGram = (rate * makingPercent) / 100;
  const makingCharge = makingPerGram * grossWeight * pcs;
  const makingRsValue = makingInRs * grossWeight * pcs;

  // making on deposit/ad_wgt (for gst on making deposit tracking)
  const makingPerGramDep = (rate * makingPercent) / 100;
  const makingChargeDep = makingPerGramDep * ad_wgt;
  const makingRsDep = makingInRs * ad_wgt;

  // discount on making (for both)
  let makingTotalRs = makingCharge + makingRsValue;
  let makingTotalRsDeposit = makingChargeDep + makingRsDep;
  if (making_dsc) {
    const disc1 = (makingTotalRs * making_dsc) / 100;
    makingTotalRs = makingTotalRs - disc1;
    const disc2 = (makingTotalRsDeposit * making_dsc) / 100;
    makingTotalRsDeposit = makingTotalRsDeposit - disc2;
  }

  // gst on making (if making_gst_percentage provided)
  const gstOnMaking = making_gst_percentage
    ? (makingTotalRs * making_gst_percentage) / 100
    : 0;
  const gstOnMakingDep = making_gst_percentage
    ? (makingTotalRsDeposit * making_gst_percentage) / 100
    : 0; // tracked but not used separately

  // rate total + gst on gold
  let rateTotal = 0;
  let gstOnGold = 0;

  if (mrp > 0) {
    // MRP mode
    rateTotal = mrp * pcs;
    gstOnGold = (rateTotal * tax_rate) / 100;
  } else {
    // Standard mode
    rateTotal = rate * netWeight * pcs + wst + hall + other + makingTotalRs; // note: stone/diamond added later
    gstOnGold = (rate * netWeight * pcs * tax_rate) / 100;
  }

  // stone + diamond
  const stoneTotal = stoneW * stoneV;
  const diamondTotal = diamondW * diamondV;

  // product total before tax
  const productTotal = rateTotal + stoneTotal + diamondTotal;

  // tax logic: if no "gst on making" %, use overall gst on product total; else gold gst + making gst
  const overallGstNoMaking = (productTotal * tax_rate) / 100;
  const lineGst = making_gst_percentage
    ? gstOnGold + gstOnMaking
    : overallGstNoMaking;

  return {
    // echo back editable fields
    ...line,
    qty: pcs,
    gross_weight: grossWeight,
    net_weight: netWeight,
    ad_wgt,
    rate,
    making: makingPercent,
    makingInRs,
    making_dsc,
    making_gst_percentage: making_gst_percentage ?? "",
    tax_rate,
    wastageCharge: wst,
    hallmarkCharge: hall,
    otherCharge: other,
    stone_weight: stoneW,
    stone_value: stoneV,
    diamondDetails: diamondW,
    diamondValue: diamondV,
    fixed_amt: mrp,

    // computed
    mkg_chg_RS_P: round2(makingTotalRs),
    gstOnGold: round2(gstOnGold),
    gstOnMaking: round2(gstOnMaking),
    rateTotal: round2(rateTotal),
    stoneTotal: round2(stoneTotal),
    diamondTotal: round2(diamondTotal),
    pro_total: round2(productTotal),
    lineGst: round2(lineGst),
  };
}

const round2 = (v) => Number((+v).toFixed(2));

// ------------------------------
// Page
// ------------------------------
export default function EditBillPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // header / bill-level
  const [billId, setBillId] = useState(null);
  const [billno, setBillno] = useState("");
  const [date, setDate] = useState("");
  const [bill_inv, setBillInv] = useState(0); // 0: Estimate? 1: Invoice? (toggle per your rules)
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountRs, setDiscountRs] = useState(0);
  const [additionRs, setAdditionRs] = useState(0);
  const [additionDetail, setAdditionDetail] = useState("");

  // customer snapshot
  const [customer, setCustomer] = useState(null);

  // lines + payments
  const [lines, setLines] = useState([]);
  const [payments, setPayments] = useState([]);

  // totals
  const computedLines = useMemo(() => lines.map(computeLine), [lines]);
  const grossTotal = useMemo(
    () => round2(computedLines.reduce((s, l) => s + n(l.pro_total), 0)),
    [computedLines]
  );
  const totalGst = useMemo(
    () => round2(computedLines.reduce((s, l) => s + n(l.lineGst), 0)),
    [computedLines]
  );

  // order-level discount
  const orderLevelDiscount = useMemo(() => {
    const pct = (grossTotal * n(discountPercent)) / 100;
    return round2(pct + n(discountRs));
  }, [grossTotal, discountPercent, discountRs]);

  // grand total (server’s total_price)
  const totalPrice = useMemo(
    () => round2(grossTotal - orderLevelDiscount + n(additionRs) + totalGst),
    [grossTotal, orderLevelDiscount, additionRs, totalGst]
  );

  const totalPayment = useMemo(
    () => round2(payments.reduce((s, p) => s + n(p.price), 0)),
    [payments]
  );

  const due = useMemo(
    () => round2(totalPrice - totalPayment),
    [totalPrice, totalPayment]
  );

  // fetch data
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setError("Missing bill id in query param (?id=)");
      setLoading(false);
      return;
    }
    setBillId(id);

    const token = getCookie("access_token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axios.get(
          `https://apibrize.brizindia.com/api/printbill/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const b = res.data;
        setBillno(b.billno || "");
        setDate(b.date || "");
        setBillInv(n(b.bill_inv));
        setDiscountPercent(n(b.discountPercent));
        setDiscountRs(n(b.discountRs));
        setAdditionRs(n(b.additionRS));
        setAdditionDetail(b.additionDetail || "");

        setCustomer({
          id: b?.users?.id,
          name: b?.users?.name,
          phone: b?.users?.customers?.[0]?.phone || "",
          address: b?.users?.customers?.[0]?.address || "",
          gstNo: b?.users?.customers?.[0]?.gstNo || "",
        });

        // map details to local line state (keep keys consistent with computeLine)
        setLines(
          (b.details || []).map((d) => ({
            id: d.id,
            product_id: d.product_id,
            product_name: d.product_name || "",
            product_code: d.product_code || "",
            hsn: d.hsn || "",
            tax_rate: d.tax_rate || 0,

            qty: d.qty || 1,
            gross_weight: d.gross_weight || 0,
            net_weight: d.net_weight || 0,
            ad_wgt: d.ad_wgt || 0,

            rate: d.rate || 0,
            fixed_amt: d.fixed_amt || 0, // MRP

            making: d.making || 0,
            makingInRs: d.makingInRs || 0,
            making_dsc: d.making_dsc || 0,
            making_gst_percentage: d.making_gst_percentage || "",

            wastageCharge: d.wastageCharge || 0,
            hallmarkCharge: d.hallmarkCharge || 0,
            otherCharge: d.otherCharge || 0,

            stone_weight: d.stone_weight || 0,
            stone_value: d.stone_value || 0,
            diamondDetails: d.diamondDetails || 0,
            diamondValue: d.diamondValue || 0,

            huid: d.huid || "",
            hallmark: d.hallmark || "",
            description: d.description || "",
          }))
        );

        setPayments(
          (b.payments || []).map((p) => ({
            id: p.id,
            payment_method: p.payment_method,
            price: Number(p.price) || 0,
          }))
        );
      } catch (e) {
        setError("Failed to load bill. Check console.");
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onLineChange = (idx, field, value) => {
    setLines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addPaymentRow = () => {
    setPayments((p) => [...p, { payment_method: "cash", price: 0 }]);
  };
  const onPaymentChange = (idx, field, value) => {
    setPayments((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [field]: field === "price" ? Number(value) : value,
      };
      return next;
    });
  };
  const removePaymentRow = (idx) => {
    setPayments((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    if (!billId) return;
    const token = getCookie("access_token");
    if (!token) return alert("Missing token");

    // Build payload similar to your create payload, with computed values included
    const computed = computedLines;
    console.log("Computed lines:", computed);
    const payload = {
      bill_inv,
      dateid: date,
      //customer id
      customer_id: customer?.id || null,
      // order-level summary
      grossTotal: grossTotal,
      totalTax: Math.round(totalGst),
      discountTotal: orderLevelDiscount,
      discountPercent: n(discountPercent),
      discountRs: n(discountRs),
      additionRs: n(additionRs),
      additionDetail: additionDetail || "",

      // products (server expects certain keys from your create payload)
      products: computed.map((l) => ({
        name: l.product_name,
        code: l.product_code,
        tax_rate: l.tax_rate,
        hsn: l.hsn,
        product_id: l.product_id,

        grossWeight: l.gross_weight,
        description: l.description || "",
        netWeight: l.net_weight,
        ad_wgt: l.ad_wgt,

        making: l.making,
        rate: l.rate,

        stoneWeight: l.stone_weight,
        stoneValue: l.stone_value,

        huid: l.huid || "",
        hallmark: l.hallmark || "",
        hallmarkCharge: l.hallmarkCharge,
        wastageCharge: l.wastageCharge,
        otherCharge: l.otherCharge,
        makingInRs: l.makingInRs || 0,

        making_dsc: l.making_dsc || 0,
        making_gst_percentage: l.making_gst_percentage || "",
        product_id: l.product_id,

        diamondDetails: l.diamondDetails,
        diamondValue: l.diamondValue,
        fixed_amt: l.fixed_amt || 0,

        qty: l.qty,

        pro_total: l.pro_total, // product total before tax line (as you store)
        gstOnGold: l.gstOnGold,
        gstOnMaking: l.gstOnMaking,
        mkg_chg_RS_P: l.mkg_chg_RS_P,
      })),

      paymentMethods: payments.map((p) => ({
        payment_method: p.payment_method,
        price: n(p.price),
      })),
    };
    console.log("Saving payload:", payload);
    setSaving(true);
    try {
      // ⚠️ Adjust the endpoint to your actual update route if different
      await axios.put(
        `https://apibrize.brizindia.com/api/updateCheckoutResto/${billId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Bill updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Update failed. See console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Bill: {billno}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <a
            href={`/jwellery/reports/billwise/`}
            className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"
          >
            Back
          </a>
        </div>
      </div>

      {/* Bill meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <label className="block text-sm text-gray-600">Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded-lg"
            value={date || ""}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="border rounded-lg p-4">
          <label className="block text-sm text-gray-600">Bill Type</label>
          <select
            className="w-full border px-3 py-2 rounded-lg"
            value={bill_inv}
            onChange={(e) => setBillInv(Number(e.target.value))}
          >
            <option value={1}>Tax Invoice</option>
            <option value={0}>Estimate</option>
          </select>
        </div>
        <div className="border rounded-lg p-4">
          <label className="block text-sm text-gray-600">Bill No</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg bg-gray-50"
            value={billno}
            readOnly
          />
        </div>
      </div>

      {/* Customer snapshot */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">Customer</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50"
              value={customer?.name || ""}
              readOnly
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50"
              value={customer?.phone || ""}
              readOnly
            />
          </div>
          <div>
            <label className="text-sm">GST No</label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50"
              value={customer?.gstNo || ""}
              readOnly
            />
          </div>
          <div>
            <label className="text-sm">Address</label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50"
              value={customer?.address || ""}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Lines table */}
      <div className="border rounded-lg overflow-x-auto mb-6">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2">HSN</th>
              <th className="p-2">Tax%</th>
              <th className="p-2">Qty</th>
              <th className="p-2">G.Wt</th>
              <th className="p-2">N.Wt</th>
              <th className="p-2">Ad.Wt</th>
              <th className="p-2">Rate</th>
              <th className="p-2">MRP</th>
              <th className="p-2">Making %</th>
              <th className="p-2">Making Rs/g</th>
              <th className="p-2">Making Disc %</th>
              <th className="p-2">Making GST %</th>
              <th className="p-2">Wastage</th>
              <th className="p-2">Hallmark</th>
              <th className="p-2">Other</th>
              <th className="p-2">Stone W</th>
              <th className="p-2">Stone ₹/W</th>
              <th className="p-2">Dia W</th>
              <th className="p-2">Dia ₹/W</th>
              <th className="p-2">Line Total</th>
              <th className="p-2">Line GST</th>
            </tr>
          </thead>
          <tbody>
            {computedLines.map((l, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 min-w-[160px]">
                  <div className="font-medium">{l.product_name || "-"}</div>
                  <div className="text-xs text-gray-500">{l.product_code}</div>
                </td>
                <td className="p-2">
                  <input
                    value={l.hsn || ""}
                    onChange={(e) => onLineChange(idx, "hsn", e.target.value)}
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.tax_rate}
                    onChange={(e) =>
                      onLineChange(idx, "tax_rate", e.target.value)
                    }
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    value={l.qty}
                    onChange={(e) => onLineChange(idx, "qty", e.target.value)}
                    className="w-16 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.gross_weight}
                    onChange={(e) =>
                      onLineChange(idx, "gross_weight", e.target.value)
                    }
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.net_weight}
                    onChange={(e) =>
                      onLineChange(idx, "net_weight", e.target.value)
                    }
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.ad_wgt}
                    onChange={(e) =>
                      onLineChange(idx, "ad_wgt", e.target.value)
                    }
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    value={l.rate}
                    onChange={(e) => onLineChange(idx, "rate", e.target.value)}
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.fixed_amt}
                    onChange={(e) =>
                      onLineChange(idx, "fixed_amt", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    value={l.making}
                    onChange={(e) =>
                      onLineChange(idx, "making", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.makingInRs}
                    onChange={(e) =>
                      onLineChange(idx, "makingInRs", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.making_dsc}
                    onChange={(e) =>
                      onLineChange(idx, "making_dsc", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder=""
                    value={l.making_gst_percentage}
                    onChange={(e) =>
                      onLineChange(idx, "making_gst_percentage", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    value={l.wastageCharge}
                    onChange={(e) =>
                      onLineChange(idx, "wastageCharge", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.hallmarkCharge}
                    onChange={(e) =>
                      onLineChange(idx, "hallmarkCharge", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.otherCharge}
                    onChange={(e) =>
                      onLineChange(idx, "otherCharge", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    value={l.stone_weight}
                    onChange={(e) =>
                      onLineChange(idx, "stone_weight", e.target.value)
                    }
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.stone_value}
                    onChange={(e) =>
                      onLineChange(idx, "stone_value", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    value={l.diamondDetails}
                    onChange={(e) =>
                      onLineChange(idx, "diamondDetails", e.target.value)
                    }
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={l.diamondValue}
                    onChange={(e) =>
                      onLineChange(idx, "diamondValue", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </td>

                <td className="p-2 text-right font-medium">₹{l.pro_total}</td>
                <td className="p-2 text-right">₹{l.lineGst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill-level adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <label className="text-sm text-gray-600">Discount %</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded-lg"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>
        <div className="border rounded-lg p-4">
          <label className="text-sm text-gray-600">Discount ₹</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded-lg"
            value={discountRs}
            onChange={(e) => setDiscountRs(e.target.value)}
          />
        </div>
        <div className="border rounded-lg p-4">
          <label className="text-sm text-gray-600">Addition ₹</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded-lg"
            value={additionRs}
            onChange={(e) => setAdditionRs(e.target.value)}
          />
        </div>
        <div className="border rounded-lg p-4">
          <label className="text-sm text-gray-600">Addition Detail</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
            value={additionDetail}
            onChange={(e) => setAdditionDetail(e.target.value)}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Payments</h3>
          <div className="space-y-3">
            {payments.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <select
                  className="border px-3 py-2 rounded-lg"
                  value={p.payment_method}
                  onChange={(e) =>
                    onPaymentChange(idx, "payment_method", e.target.value)
                  }
                >
                  <option value="cash">cash</option>
                  <option value="card">card</option>
                  <option value="upi">upi</option>
                  <option value="advance">advance</option>
                  <option value="others">others</option>
                </select>
                <input
                  type="number"
                  className="border px-3 py-2 rounded-lg w-40"
                  value={p.price}
                  onChange={(e) =>
                    onPaymentChange(idx, "price", e.target.value)
                  }
                />
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removePaymentRow(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="mt-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
              onClick={addPaymentRow}
            >
              + Add Payment Row
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Gross Total:</span>
              <span>₹{grossTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Discount:</span>
              <span>-₹{orderLevelDiscount}</span>
            </div>
            <div className="flex justify-between">
              <span>Additions:</span>
              <span>+₹{round2(additionRs)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST:</span>
              <span>+₹{totalGst}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-1 border-t mt-2">
              <span>Grand Total:</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Paid:</span>
              <span>₹{totalPayment}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Due:</span>
              <span>₹{due}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save too */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
