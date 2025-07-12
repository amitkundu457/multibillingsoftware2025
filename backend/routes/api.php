<?php

use Illuminate\Http\Request;
use App\Models\UserInformation;
use App\Models\ProductServiceGroup;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaxController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CoinController;
use App\Http\Controllers\Api\RateController;
use App\Http\Controllers\Api\TabsController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\MasterController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\printStatusController;
use App\Http\Controllers\Api\PurityController;
use App\Http\Controllers\Api\PackageServiceNameController;
use App\Http\Controllers\Api\OrderPackageServiceController;
use App\Http\Controllers\Api\ReminderAndFollowUpController;
use App\Http\Controllers\Api\BISNumberController;
use App\Http\Controllers\Api\BillCountController;
use App\Http\Controllers\Api\KotTableController;
use App\Http\Controllers\Api\familyBookingController;
use App\Http\Controllers\Api\ParcelOrderController;
use App\Http\Controllers\Api\ParcelTypeController;

use App\Http\Controllers\Api\SmsCredentialController;
use App\Http\Controllers\Api\FrontendContnetController;


use App\Http\Controllers\Api\ParcelPaymentController;
use App\Http\Controllers\Api\FamilyBookingPaymentController;



use App\Http\Controllers\Api\SaloonStockController;






use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\BarcodeController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\formOtpController;
use App\Http\Controllers\APi\LoyaltyController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\MastersBillController;
use App\Http\Controllers\StockReturnController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\KarigariController;
use App\Http\Controllers\Api\KarigarListController;

use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\SolutionController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserInfoController;
use App\Http\Controllers\Api\EcosystemController;
use App\Http\Controllers\Api\RateMasterController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DistrubuterController;
use App\Http\Controllers\Api\SaleProductController;
use App\Http\Controllers\Api\SalesAssignController;
use App\Http\Controllers\Api\AccountGroupController;
use App\Http\Controllers\Api\AccountMasterController;
use App\Http\Controllers\Api\MasterSettingController;
use App\Http\Controllers\Api\ProductLoyaltyController;
use App\Http\Controllers\Api\PurchaseReturnController;
use App\Http\Controllers\Api\SalesReturnController;
use App\Http\Controllers\Api\KotOrderController;

use App\Http\Controllers\Api\selectedProductController;
use App\Http\Controllers\Api\redeemPointSetupController;
use App\Http\Controllers\Api\ProductAndServiceController;
use App\Http\Controllers\Api\RoleAndPermissionController;
use App\Http\Controllers\Api\SaloonOrderController;







use App\Http\Controllers\Api\TermsAndConditionController;
use App\Http\Controllers\Api\AccountTypeController;


use App\Http\Controllers\Api\StylistController;


use App\Http\Controllers\Api\SmsSettingController;






use App\Http\Controllers\Api\PRoductserviceTypeController;
use App\Http\Controllers\Api\StockReturnPaymentController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Api\CustomerRedeemPointController;
use App\Http\Controllers\Api\MembershipController;
use App\Http\Controllers\Api\PackageAssignController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\ProductServiceGroupController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\MembershipSaleController;
use App\Models\TaxType;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
// require __DIR__ . '/auth.php';

Route::group([

    'middleware' => 'jwt.verify',
    'prefix' => 'auth'

], function ($router) {

    Route::get('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('/distrubuters', [DistrubuterController::class, 'store']);
    Route::get('/agme', [AuthController::class, 'me']);
    Route::get('/commissionreport', [ReportController::class, 'commissionReport']);
});
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'Register']);


//forgot password
Route::post('/forgot-password', [PasswordResetLinkController::class, 'resetPassword']);



Route::get('/solutions', [SolutionController::class, 'index']);
Route::post('/solutions', [SolutionController::class, 'store']);       // Create
Route::post('/solutions/update/{id}', [SolutionController::class, 'update']); // Edit/Update
Route::delete('/solutions/{id}', [SolutionController::class, 'destroy']); // Delete


Route::get('/brands', [BrandController::class, 'index']);
Route::post('/brands', [BrandController::class, 'store']); // Upload
Route::post('/brands/update/{id}', [BrandController::class, 'update']); // Edit
Route::delete('/brands/{id}', [BrandController::class, 'destroy']); // Delete

Route::post('/family-booking-payments', [FamilyBookingPaymentController::class, 'store']);

Route::get('/ecosystems', [EcosystemController::class, 'index']); // Display records
Route::post('/ecosystems', [EcosystemController::class, 'store']); // Create a record
Route::post('/ecosystems/update/{id}/', [EcosystemController::class, 'update']); // Edit a record
Route::delete('/ecosystems/{id}', [EcosystemController::class, 'destroy']); // Delete a record


Route::get('products', [ProductController::class, 'index']);
Route::post('products', [ProductController::class, 'store']);
Route::post('products/{id}', [ProductController::class, 'update']);
Route::delete('products/{id}', [ProductController::class, 'destroy']);


Route::resource('tabs', TabsController::class);
Route::post('tabs/update/{id}', [TabsController::class, 'update']);

Route::resource('services', ServiceController::class);
Route::post('/services/update/{id}', [ServiceController::class, 'update']);
Route::resource('sliders', SliderController::class);
Route::post('sliders/update/{id}', [SliderController::class, 'update']);
Route::post('/frontend-settings', [FrontendContnetController::class, 'storeOrUpdate']);
//user_information

Route::get('/user-infos', [UserInfoController::class, 'index']);
Route::get('/user-infos/count', [UserInfoController::class, 'count']);
Route::post('/user-infos', [UserInfoController::class, 'store']);
Route::post('/user-infos/{id}', [UserInfoController::class, 'update']);
Route::post('/user-infosdel/{id}', [UserInfoController::class, 'destroy']);
Route::get('/user-infos/{id}', [UserInfoController::class, 'show']);


Route::get('distributer-assign', [UserInfoController::class, 'distributerassignclient']);



Route::get('/distributors/search', [UserInfoController::class, 'distributersearch']);
Route::post('/assign-client', [UserInfoController::class, 'assignClient']);

Route::post('formverivy', [formOtpController::class, 'storeEmail']);


Route::post('employees', [EmployeeController::class, 'store']);
Route::get('employees', [EmployeeController::class, 'index']);
Route::post('employees/{id}', [EmployeeController::class, 'update']);
Route::delete('employees/{id}', [EmployeeController::class, 'destroy']);


Route::post('salesassign', [SalesAssignController::class, 'store']);
Route::get('salesassign', [SalesAssignController::class, 'index']);
Route::post('salesassign/{id}', [SalesAssignController::class, 'update']);
Route::delete('salesassign/delete/{id}', [SalesAssignController::class, 'destroy']);


Route::get('/sale-products', [SaleProductController::class, 'index']);
Route::post('/sale-products', [SaleProductController::class, 'store']);
Route::get('/sale-products/{id}', [SaleProductController::class, 'show']);
Route::post('/sale-products/{id}', [SaleProductController::class, 'update']);
Route::delete('/sale-products/{id}', [SaleProductController::class, 'destroy']);



Route::prefix('sms-credentials')->group(function () {
    Route::post('/', [SmsCredentialController::class, 'store']);      // Create
    Route::get('/', [SmsCredentialController::class, 'index']);       // List
    Route::put('/{id}', [SmsCredentialController::class, 'update']);  // UpdateAdd commentMore actions
    Route::delete('/{id}', [SmsCredentialController::class, 'destroy']); // Delete
});

Route::get('/distrubuters', [DistrubuterController::class, 'index']);
Route::get('/distrubuters/count', [DistrubuterController::class, 'count']);
Route::post('/distrubuters', [DistrubuterController::class, 'store']);
Route::get('/distrubuters/{id}', [DistrubuterController::class, 'show']);
Route::post('/distrubuters/{id}', [DistrubuterController::class, 'update']);
Route::delete('/distrubuters/{id}', [DistrubuterController::class, 'destroy']);


Route::get('/customers', action: [CustomerController::class, 'index']); // Fetch all customers
Route::post('/customers', [CustomerController::class, 'store']); // Create a customer
Route::post('/customers/{id}', [CustomerController::class, 'update']); // Update a customer
Route::delete('/customers/{id}', [CustomerController::class, 'destroy']); // Delete a customer
Route::get('/customer-visit-sources', [CustomerController::class, 'getVisitSourceCounts']);
// Route::get('/customers/get', action: [familyBookingController::class, 'show']); // Fetch all customers
Route::post('/send-customer-sms', [CustomerController::class, 'sendCustomerSms']);


Route::get('/customerstype', [CustomerController::class, 'typeindex']); // Fetch all customers
Route::post('/customerstype', [CustomerController::class, 'typestore']); // Create a customer
Route::post('/customerstype/{id}', [CustomerController::class, 'typeupdate']); // Update a customer
Route::delete('/customerstype/{id}', [CustomerController::class, 'typedestroy']); // Delete a customer



Route::get('/customersubtypes', [CustomerController::class, 'subtypeindex']); // Fetch all customers
Route::post('/customersubtypes', [CustomerController::class, 'subtypestore']); // Create a customer
Route::post('/customersubtypes/{id}', [CustomerController::class, 'subtypeupdate']); // Update a customer
Route::delete('/customersubtypes/{id}', [CustomerController::class, 'subtypedestroy']); // Delete a customer


Route::get('permission', [RoleAndPermissionController::class, 'permission']);

Route::post('/roles', [RoleAndPermissionController::class, 'store']);
Route::get('/roles', [RoleAndPermissionController::class, 'index']); // Fetch roles

Route::post('/roles/{id}', [RoleAndPermissionController::class, 'update']); // Update rol
Route::get('/roles/{id}', [RoleAndPermissionController::class, 'show']); // Update rol

// saloon
Route::post('/Saloon-product-services', [ProductAndServiceController::class, 'Saloonstore']);
Route::get('/Saloon-product-services', [ProductAndServiceController::class, 'Saloonindex']);
Route::get('/Saloon-service', [ProductAndServiceController::class, 'getAllService']);
Route::get('/product-service-saloon', [ProductAndServiceController::class,'productAndServiceGetFilterSaloon']);
Route::get('/Saloon-products', [ProductAndServiceController::class, 'getAllProducts']);



Route::get('/product-services', [ProductAndServiceController::class, 'index']);
Route::post('/product-services', [ProductAndServiceController::class, 'store']);
Route::post('/product-services/{id}', [ProductAndServiceController::class, 'update']);
Route::delete('/product-services/{productService}', [ProductAndServiceController::class, 'destroy']);
Route::get('/product-and-service', [ProductAndServiceController::class,'productAndServiceGet']);
//saloon update it
Route::post('/update-product/{id}', action: [ProductAndServiceController::class, 'updateSalooanProduct']);
Route::get('/product-services/selected-product', [selectedProductController::class, 'index']);
Route::post('/produc', [selectedProductController::class, 'store']);
Route::delete('/produc/{id}', [selectedProductController::class, 'destroy']);
Route::put('/produc/{id}', [selectedProductController::class, 'destroy']);



Route::post('test', [AuthController::class, 'yourMethod']);
Route::get('product-service-groups', [ProductServiceGroupController::class, 'index']);
Route::post('product-service-groups', [ProductServiceGroupController::class, 'store']);
Route::get('product-service-groups/{productServiceGroup}', [ProductServiceGroupController::class, 'show']);
Route::put('product-service-groups/{productServiceGroup}', [ProductServiceGroupController::class, 'update']);
Route::delete('product-service-groups/{productServiceGroup}', [ProductServiceGroupController::class, 'destroy']);



Route::get('company', [CompanyController::class, 'index']);
Route::post('company', [CompanyController::class, 'store']);
Route::get('company/{company}', [CompanyController::class, 'show']);
Route::put('company/{company}', [CompanyController::class, 'update']);
Route::delete('company/{company}', [CompanyController::class, 'destroy']);



Route::get('rate', [RateController::class, 'index']);
Route::post('rate', [RateController::class, 'store']);
Route::get('rate/{rate}', [RateController::class, 'show']);
Route::put('rate/{rate}', [RateController::class, 'update']);
Route::delete('rate/{rate}', [RateController::class, 'destroy']);



Route::get('type', [PRoductserviceTypeController::class, 'index']);
Route::post('type', [PRoductserviceTypeController::class, 'store']);
Route::get('type/{type}', [PRoductserviceTypeController::class, 'show']);
Route::put('type/{type}', [PRoductserviceTypeController::class, 'update']);
Route::delete('type/{type}', [PRoductserviceTypeController::class, 'destroy']);


Route::get('coin', [CoinController::class, 'index']);
Route::post('coin', [CoinController::class, 'store']);
Route::get('coinid', [CoinController::class, 'show']);
Route::post('coin/{coin}', [CoinController::class, 'update']);
Route::delete('coin/{coin}', [CoinController::class, 'destroy']);


Route::post('/set-coins-per-order', [CoinController::class, 'setCoinsPerOrder']);
Route::get('/get-coins-per-order', [CoinController::class, 'getCoinsPerOrder']);



Route::post('/bis-number-store', [BISNumberController::class, 'store']);
Route::get('/bis-number-get', [BISNumberController::class, 'index']);







Route::get('/order', [OrderController::class, 'index']);
Route::post('/order', [OrderController::class, 'storeCheckout']);
//restro-api
Route::post('/resto-order', [OrderController::class, 'storeCheckoutResto']);
//Route::get('order/{order}', [OrderController::class, 'show']);
Route::get('/orders/today', [OrderController::class, 'getTodayOrders']);
Route::get('/orders/category', [OrderController::class, 'OrderByCategory']);
//today order count for today delivery
Route::get("/todaydelivery",[OrderController::class,'todayOrderCount']);
//search orderby billno
Route::get('/orders/search', [OrderController::class, 'Ordersearch']);
//total oderinvoice
Route::get('/orderinvoice', [OrderController::class, 'orderInvoice']);

//order and bill count
Route::get('billCount', [OrderController::class, 'BillCount']);
Route::get('orderCount', [OrderController::class, 'OrderCount']);




// Route::post('coin/{coin}', [storeCheckout::class, 'update']);
// Route::delete('coin/{coin}', [storeCheckout::class, 'destroy']);
//saloon order
Route::get('/saloon-order', [SaloonOrderController::class, 'index']);
Route::post('/saloon-order', [SaloonOrderController::class, 'storeCheckout']);
Route::get('saloon-order/{order}', [SaloonOrderController::class, 'show']);

Route::post('order-slip', [OrderController::class, 'OrderSlip']);
Route::get('invoice-ids', [OrderController::class, 'getInvoiceIds']);


Route::post('Saloon-order-slip', [SaloonOrderController::class, 'OrderSlip']);
Route::get('saloon-invoice-ids', [SaloonOrderController::class, 'getInvoiceIds']);
Route::get('saloon-order-cash', [SaloonOrderController::class, 'getDailyCashReportsSalooon']);


//fetch partial oorderrder data
Route::get('/partial-order', [OrderController::class, 'partialOrderData']);
Route::post('/partial-order', [OrderController::class, 'storePartialOrderData']);



Route::get('/customers/searchres', [CustomerController::class, 'searchByPhoneResto']);


Route::get('/customers/search', [CustomerController::class, 'searchByPhone']);
Route::get('/bill-no', [OrderController::class, 'generateNextBillNo']);
Route::get('/order-bill-no', [OrderController::class, 'generateNextOrderBillNo']);

Route::get('/printbill/{id}', [OrderController::class, 'printdata']);
Route::get('/saloon-printbill/{id}', [SaloonOrderController::class, 'printdata']);

Route::post('/coinpurchase', [CoinController::class, 'coinpurchase']);
//admin side recharge
Route::post('/coinpurchase-admin', [CoinController::class, 'coinpurchaseadmin']);



//status controller
Route::get('/print-status', [printStatusController::class, 'index']);



// Inventory
Route::get('/stocks', [StockController::class, 'index']);
Route::get('/adjuststock', [StockController::class, 'adjust']);
Route::get('/stock/{id}', [StockController::class, 'show']);
Route::post('/stock', [StockController::class, 'store']);
Route::put('/stock/{id}', [StockController::class, 'update']);
Route::delete('/stock/{id}', [StockController::class, 'destroy']);
Route::delete('/delete-all-stock', [StockController::class, 'deleteAllStock']);

Route::post('/upload/stock', [StockController::class, 'uploadCsv']);
Route::get('/download-sample-stock', [StockController::class, 'downloadSampleStock']);




Route::apiResource('account-masters', AccountMasterController::class);
// Route::post('account-masters', AccountMasterController::class,'store');


Route::get('account-groups', [AccountGroupController::class, 'index']);
Route::post('account-groups', [AccountGroupController::class, 'store']);
Route::get('account-groups/{id}', [AccountGroupController::class, 'show']);
Route::post('account-groups/{id}', [AccountGroupController::class, 'update']);
Route::delete('account-groups/{id}', [AccountGroupController::class, 'destroy']);



Route::get('accounts', [AccountController::class, 'index']);
Route::post('accounts', [AccountController::class, 'store']);
Route::get('accounts/{id}', [AccountController::class, 'show']);
Route::post('accounts/{id}', [AccountController::class, 'update']);
Route::delete('accounts/{id}', [AccountController::class, 'destroy']);
Route::get('/last-transaction-number/{type}', [AccountController::class, 'getLastTransactionNumber']);


Route::get('orderreport', [OrderController::class, 'orderslipdata']);
Route::get('billingreport', [OrderController::class, 'billingData']);
Route::get('/orderreport-report', [OrderController::class, 'report']);

Route::get('/reportForBill-report', [OrderController::class, 'reportForBill']);


Route::get('/reportForproduct-report', [OrderController::class, 'reportForProductWise']);
Route::get('/item-list-report', [ProductAndServiceController::class, 'show']);
Route::get('/item-list-forreport', [ProductAndServiceController::class, 'report']);

// Purchase
Route::get('purchase', [PurchaseController::class, 'index']);
Route::post('purchase', [PurchaseController::class, 'store']);
Route::put('purchase/{id}', [PurchaseController::class, 'update']);
Route::delete('purchase/{id}', [PurchaseController::class, 'destroy']);
Route::delete('/delete-all-purchase', [PurchaseController::class, 'deleteAllPurchase']);


//saloon-purchase 
Route::post('/saloon-purchase',[PurchaseController::class,'Saloonstore']);

//bulk upload purchase
Route::get('/download-sample-purchase', [PurchaseController::class, 'downloadSamplePurchase']);
Route::post('/upload/purchase', [PurchaseController::class, 'uploadPurchaseCsv']);




// Karigari
Route::get('karigari', [KarigariController::class, 'index']);
Route::get('karigari/{id}', [KarigariController::class, 'show']);
Route::post('karigari', [KarigariController::class, 'store']);
Route::post('karigariupdate/{id}', [KarigariController::class, 'update']);


// KarigarList Routes
Route::prefix('karigar-list')->group(function () {
    Route::get('/', [KarigarListController::class, 'index']); // Get all KarigarLists
    Route::post('/', [KarigarListController::class, 'store']); // Create a new KarigarList
    Route::get('/{id}', [KarigarListController::class, 'show']); // Get a specific KarigarList
    Route::post('/{id}', [KarigarListController::class, 'update']); // Update a KarigarList
    Route::delete('/{id}', [KarigarListController::class, 'destroy']); // Delete a KarigarList
});


Route::delete('karigari/{id}', [KarigariController::class, 'destroy']);
Route::get('/client-report', [ReportController::class, 'distributerassignclient']);
Route::apiResource('enquiry', EnquiryController::class);
Route::get('/enquiry/counts', [EnquiryController::class, 'getTotalCount']);
Route::get('/enquiries/today', [EnquiryController::class, 'getTodayEnquiries']);


Route::post('master', [MasterSettingController::class, 'store']);
Route::post('master-update', [MasterSettingController::class, 'update']);
//logo for bill
Route::post('masterlogobill', [MastersBillController::class, 'store']);

Route::put('/masterlogobill/update/{id}', [MastersBillController::class, 'update']);
//cover image 
Route::post('/cover/upload', [MastersBillController::class,'storeCover']);
Route::get('/cover/upload', [MastersBillController::class,'getCover']);

//qr dode image
Route::post('/qr/upload', [MastersBillController::class,'storeQr']);
Route::get('/qr/upload', [MastersBillController::class,'getqr']);

//seperate
Route::get('/clinet', [MastersBillController::class,'clientRoleWiseDetails']);

Route::get('/masterlogobill', [MastersBillController::class, 'show']); // Get Logo

Route::get('master', [MasterSettingController::class, 'show']);
Route::get('graphview', [ReportController::class, 'graphView']);


//tax controller
Route::get('/tax', [TaxController::class, 'index']);
Route::post('/tax', [TaxController::class, 'store']);
Route::put('/tax/{id}', [TaxController::class, 'update']);
Route::delete('/tax/{id}', [TaxController::class, 'delete']);


Route::resource('barcodes', BarcodeController::class);
Route::post('barcode-print-history', [BarcodeController::class,'storePrintHistory']);
Route::get('barcode-print-history', [BarcodeController::class,'getPrintHistory']);


Route::get('barcodes-delete/{id}', [BarcodeController::class, 'destroy']);
// Route::get('barcode-report', [BarcodeController::class, 'show']);
// Route::get('barcode-report/{id}', [BarcodeController::class, 'show']);
Route::get('barcode-report', [BarcodeController::class, 'show']);
Route::get('next-barcode', [BarcodeController::class, 'getNextBarcode']);

Route::get('barcode-report-pdf', [BarcodeController::class, 'report']);
Route::get('download-sample-barcode', [BarcodeController::class, 'downloadSampleBarcode']);
Route::post('/upload/barcode', [BarcodeController::class, 'uploadBarcodeCsv']);

Route::get('/countByAuthenticatedUser', [BarcodeController::class, 'countByAuthenticatedUser']);







//terms and conditions controllers

Route::get('/terms-condition', [TermsAndConditionController::class, 'index']);
Route::post('/terms-condition', [TermsAndConditionController::class, 'store']);
Route::put('/terms-condition/{id}', [TermsAndConditionController::class, 'update']);
Route::delete('/terms-condition/{id}', [TermsAndConditionController::class, 'destroy']);
//tern and condition for invoice 
Route::post('/terms-condition-invoice' ,[TermsAndConditionController::class,'storeInvoice']);
Route::put('/terms-condition-invoice/{id}' ,[TermsAndConditionController::class,'updateTernsCondition']);
Route::get('/terms-condition-invoice',[TermsAndConditionController::class,'getInvoicecondition']);

Route::get('/suppliers', [SupplierController::class, 'index']); // Create
Route::post('/suppliers', [SupplierController::class, 'store']); // Create
Route::put('/suppliers/{id}', [SupplierController::class, 'update']); // Edit
Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']); // Delete

Route::get('/ratemasterget', [RateMasterController::class, 'index']);
Route::post('/ratemaster', [RateMasterController::class, 'store']);
Route::put('/ratemaster/{id}', [RateMasterController::class, 'update']);
Route::delete('/ratemaster/{id}', [RateMasterController::class, 'destroy']);


// Route::get('/barcode-search',[ProductAndServiceController::class,'barcodePrint']);
// Route::post('/barcode-scan',[ProductAndServiceController::class,'getProductByBarcode']);


Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::get('/barcode-search', [ProductAndServiceController::class, 'barcodePrint']);
Route::post('/barcode-scan', [ProductAndServiceController::class, 'getProductByBarcode']);

Route::get('/stock-returns', [StockReturnController::class, 'index']);
Route::post('/stock-returns', [StockReturnController::class, 'store']);

 Route::get('/stock-returns/{id}/edit', [StockReturnController::class, 'edit']);
Route::delete('/stock-returns/{id}', [StockReturnController::class, 'destroy']);
Route::get('/paymenetreport', [ReportController::class, 'getPaymentTotalByMethod']);
//saloon daily cash
Route::get('/cash-saloon', [ReportController::class, 'dailycaseSaloon']);


Route::get('celebrate', [CustomerController::class, 'celebrate']);
Route::post('bulksendmessage', [CustomerController::class, 'Marriageanniversary']);
Route::post('bulksendmessagebidthday', [CustomerController::class, 'BirthdayWish']);
Route::post('enquerymessage', [EnquiryController::class, 'sendSmsEnquery']);
//customer queries

Route::get('/customerequires-count', [CustomerController::class, 'customerequires']);

Route::prefix('reminder-follow-up')->group(function () {
    Route::get('/', [ReminderAndFollowUpController::class, 'index']);
    Route::post('/reminder', [ReminderAndFollowUpController::class, 'storeReminder']);
    Route::post('/follow-up', [ReminderAndFollowUpController::class, 'storeFollowUp']);
    Route::get('/today-counts', [ReminderAndFollowUpController::class, 'getTodayCounts']);
    Route::delete('/reminder/{id}', [ReminderAndFollowUpController::class, 'deleteReminder']);
    Route::delete('/follow-up/{id}', [ReminderAndFollowUpController::class, 'deleteFollowUp']);
});



Route::get('/purchase-returns', [PurchaseReturnController::class, 'index']);
Route::post('/purchase-returns', [PurchaseReturnController::class, 'stores']);
Route::post('/purchase-returns/{id}', [PurchaseReturnController::class, 'edit']);
Route::delete('/purchase-returns/{id}', [PurchaseReturnController::class, 'destroy']);

Route::get('/saloon-purchase-returnss',[PurchaseController::class,'fetchPurchase']);


Route::get('/sale-returns', [SalesReturnController::class, 'index']);
Route::post('/sale-returns', [SalesReturnController::class, 'stores']);
Route::post('/sale-returns/{id}', [SalesReturnController::class, 'edit']);
Route::delete('/sale-returns/{id}', [SalesReturnController::class, 'destroy']);


//purchase return
Route::post('/saloon-purchase-return', [SalesReturnController::class, 'SaloonPurchaseReturnstores']);
Route::get('/saloon-purchase-returns', [SalesReturnController::class, 'saloonPurchaseReturnIndex']);

Route::get('/saloon-purchase-all', [SalesReturnController::class, 'saloonPurchaseIndex']);
//sallon seles return
Route::post('/saloon-sale-returns',[SalesReturnController::class,'Saloonstores']);
Route::get('/saloon-sales-returns',[SalesReturnController::class,'saloonSalesReturnIndex']);
//purity

Route::get('/purity', [PurityController::class, 'index']);
Route::post('/purity', [PurityController::class, 'store']);
Route::post('/purity/{id}', [PurityController::class, 'update']);
Route::delete('/purity/{id}', [PurityController::class, 'destroy']);


//loyalty

Route::get('/loyalty', [LoyaltyController::class, 'index']);
Route::post('/loyalty', [LoyaltyController::class, 'store']);
Route::post('/loyalty/{id}', [LoyaltyController::class, 'update']);
Route::delete('/loyalty/{id}', [LoyaltyController::class, 'destroy']);


//product-loyalty
Route::get('/set-loyalty-amount', [ProductLoyaltyController::class, 'index']);
Route::post('/set-loyalty-amount', [ProductLoyaltyController::class, 'store']);


//Redeem loyalty point

Route::get('/redeem-setup', [redeemPointSetupController::class, 'index']);
Route::post('/redeem-setup', [redeemPointSetupController::class, 'store']);
Route::post('/redeem-setup/{id}', [redeemPointSetupController::class, 'update']);
Route::delete('/redeem-setup/{id}', [redeemPointSetupController::class, 'destroy']);


//customer Redeem point


Route::get('/customer-redeem-point', [CustomerRedeemPointController::class, 'index']);
Route::post('/customer-redeem-point/{id}', [CustomerRedeemPointController::class, 'store']);
Route::get('/customer-redeem-point/{id}', [CustomerRedeemPointController::class, 'show']);
Route::put('/customer-redeem-point/{id}', [CustomerRedeemPointController::class, 'update']);




// Store (Create) an appointment
Route::post('/appointments', [AppointmentController::class, 'store']);

// Get all appointments (Read)
Route::get('/appointments', [AppointmentController::class, 'index']);

// Get a single appointment by ID (Read)
Route::get('/appointments/{id}', [AppointmentController::class, 'show']);

// Update an appointment by ID (Update)
Route::post('/appointments/{id}', [AppointmentController::class, 'update']);

// Delete an appointment by ID (Delete)
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
Route::post('/assign-distributor', [DistrubuterController::class, 'assign']);

Route::post('/approve/{id}', [UserInfoController::class, 'ApproveStatus']);
Route::post('/reject/{id}', [UserInfoController::class, 'RejectStatus']);


//saloon stylist route
Route::get('/stylists', [StylistController::class, 'index']);
Route::post('/stylists', [StylistController::class, 'store']);
Route::put('/stylists/{id}', [StylistController::class, 'update']);
Route::delete('/stylists/{id}', [StylistController::class, 'destroy']);


// Account type


 Route::post('account-types', [AccountTypeController::class, 'store']);

 Route::get('account-types', [AccountTypeController::class, 'index']);

 Route::put('account-types/{id}', [AccountTypeController::class, 'update']);

 Route::delete('account-types/{id}', [AccountTypeController::class, 'destroy']);

 // Booking

 Route::post('/bookings', [BookingController::class, 'store']); // Create Booking
Route::get('/bookings', [BookingController::class, 'index']); // Get All Bookings
Route::get('/bookings/{id}', [BookingController::class, 'show']); // Get Single Booking
Route::put('/bookings/{id}', [BookingController::class, 'update']); // Update Booking
Route::delete('/bookings/{id}', [BookingController::class, 'destroy']); // Delete Booking

 Route::get('/user-infos-slug/{slug}', [UserInfoController::class, 'getShopBySlug']);

 Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
 Route::get('/reviews', [ReviewController::class, 'show']);
 Route::get('/lastlogin', [AuthController::class, 'getLastLoginCustomers']);
 Route::get('/getLastVisitCustomers', [AuthController::class, 'getLastVisitCustomers']);
 Route::get('/getLastVisitCustomers', [AuthController::class, 'getLastVisitCustomers']);
 Route::get('/customerTodaybirthday', [CustomerController::class, 'getCustomersWithTodayBirthday']);
 Route::get('/customerUpcommingbirthday', [CustomerController::class, 'getUpcomingBirthdays']);
 Route::get('/customerTodayAnniversery', [CustomerController::class, 'getCustomersWithTodayAnniversery']);
 Route::get('/customerUpcommingAnniversery', [CustomerController::class, 'getUpcomingAnnyvers']);

 //complain list
 Route::get('/complain-list', [ReviewController::class, 'reviewList']);
 Route::delete("/complain-list/{id}", [ReviewController::class, 'deleteReview']);



 //membershipplan
 Route::get('/membership-plans', [MembershipController::class, 'index']);
 Route::post('/membership-plans', [MembershipController::class,'store']);
 Route::post('/membership-plans/{id}', [MembershipController::class, 'update']);
 Route::delete('/membership-plans/{id}', [MembershipController::class, 'destroy']);

// membership
Route::get('/membership-groups', [MembershipController::class, 'memberShipServiceGroup']);
Route::post('/membership-groups', [MembershipController::class, 'addServiceToGroup']);
Route::post('/membership-groups/{id}', [MembershipController::class, 'updateServiceGroup']);
Route::delete('/membership-groups/{id}', [MembershipController::class, 'deleteServiceGroup']);
Route::get('membershipid/{id}', [MembershipController::class, 'membertypewiseload']);
Route::get('membershipidtype', [MembershipController::class, 'GroupTypeget']);
Route::post('membership-rate', [MembershipController::class, 'memberShipServiceRate']);
Route::get('membership-rate', [MembershipController::class, 'getRate']);
Route::post('membership-rate/{id}', [MembershipController::class, 'updateServiceRate']);
Route::post('membership-rate-delete/{id}', [MembershipController::class, 'deleteServiceRate']);


Route::get('/membership-sales', [MembershipSaleController::class, 'index']);
Route::post('/membership-sales', [MembershipSaleController::class, 'store']);
Route::put('/membership-sales/{id}', [MembershipSaleController::class, 'update']);
Route::delete('/membership-sales/{id}', [MembershipSaleController::class, 'destroy']);
Route::get('/membership-sales-report', [MembershipSaleController::class,'reportmember']);
Route::get('/membership-sales-summery-report', [MembershipSaleController::class,'getMembershipSummary']);
Route::get('/memberships/{customerId}', [MembershipSaleController::class, 'getMembershipsByCustomer']);



//saloonstockcontroller
Route::post('/stock/add', [SaloonStockController::class, 'addStock']);
Route::post('/stock/remove', [SaloonStockController::class, 'removeStock']);
//stock lits
Route::get('/stock-List',[SaloonStockController::class,'getStockList']);
//bulk upload stock
Route::post('/bulk-upload-stock',[SaloonStockController::class,'bulkAddStock']);
//delete the stock
Route::delete('/delete-stock/{id}',[SaloonStockController::class,'deleteStock']);


// membership payment


Route::get('/packages', [PackageController::class, 'index']);
Route::post('/packages', [PackageController::class, 'store']);
Route::get('/packages/{id}', [PackageController::class, 'show']);
Route::put('/packages/{id}', [PackageController::class, 'update']);
Route::delete('/packages/{id}', [PackageController::class, 'destroy']);


Route::get('/packagesubtypes', [PackageController::class, 'Subindex']); // Get all subtypes
Route::post('/packagesubtypes', [PackageController::class, 'Substore']); // Create subtype
Route::get('/packagesubtypes/{id}', [PackageController::class, 'Subshow']); // Get single subtype
Route::put('/packagesubtypes/{id}', [PackageController::class, 'Subupdate']); // Update subtype
Route::delete('/packagesubtypes/{id}', [PackageController::class, 'Subdestroy']); // Delete subtype

//,=manage group
Route::get('/membership-groups', [PackageController::class, 'Groupindex']);
Route::post('/membership-groups', [PackageController::class, 'Groupstore']);
Route::get('/membership-groups/{id}', [PackageController::class, 'Groupshow']);
Route::put('/membership-groups/{id}', [PackageController::class, 'Groupupdate']);
Route::delete('/membership-groups/{id}', [PackageController::class, 'Groupdestroy']);



Route::get('/package-category', [PackageController::class, 'Categoryindex']);
Route::post('/package-category', [PackageController::class, 'Categorystore']);
Route::get('/package-category/{id}', [PackageController::class, 'Categoryshow']);
Route::put('/package-category/{id}', [PackageController::class, 'Categoryupdate']);
Route::delete('/package-category/{id}', [PackageController::class, 'Categorydestroy']);


Route::get('/packageservice-type', [PackageController::class, 'packageserviceType']);
Route::get('/package-type', [PackageController::class, 'PackageType']);
Route::get('/tax-type', [TaxController::class, 'TaxType']);
Route::get('/taxf', [PackageController::class, 'tax']);



Route::get('/packagesnext-numbers', [PackageAssignController::class, 'getNextNumbers']);
Route::post('/packagesassign/{customerId}', [PackageAssignController::class, 'store']);
Route::get('/packagesassign/{customer_id}', [PackageAssignController::class, 'getPackagesByCustomer']);


Route::post('/package-services-name', [PackageServiceNameController::class, 'store']);
Route::get('/package-services-name', [PackageServiceNameController::class, 'index']);


//package order
Route::post('/order-packages', [OrderPackageServiceController::class, 'store']);
Route::post('/update-payment', [PackageAssignController::class, 'updatePayment']);
Route::get('/printpackage-bill/{id}', [OrderPackageServiceController::class, 'printData']);
Route::get('/generate-package-invoice/{id}', [OrderPackageServiceController::class, 'generatePackageInvoiceNumber']);


Route::post('/billcount',[BillCountController::class,'increment']);
Route::get('/billcountnumber', [BillCountController::class,'index']);
Route::put('/billcount/{id}', [BillCountController::class,'update']);







Route::get('/packagesassn/{packageNo}', [PackageAssignController::class, 'getPackageByNumber']);
Route::post('/packageupdate/{packageNo}', [PackageAssignController::class, 'update']);


// newpakage route 
Route::post('/newPakageStore', [PackageController::class, 'newPakageStore']);
Route::get('/newPakageindex', [PackageController::class, 'newPakageindex']);
Route::delete('/newpackagenamedestroy/{id}', [PackageController::class, 'newpackagenamedestroy']);

//trabsle 
Route::post('/translate', [PackageController::class, 'translate']);


//pakage fetch all
Route::get('/package-getall/{id}', [PackageController::class, 'pacakgeGetAll']);
Route::put('/updateUsage/{id}', [PackageController::class, 'updateUsage']);
Route::get('/packageGetAllByPhone/{id}', [PackageController::class, 'packageGetAllByPhone']);

//print package
Route::get('/printpackage/{id}', [PackageController::class, 'getPackageDetailsByAssignId']);

//saloon report 
Route::get('/package-report', [PackageController::class, 'getCustomerPackages']);



Route::get('/packagename', [PackageController::class, 'packagenameindex']);
Route::post('/packagename', [PackageController::class, 'packagenamestore']);
Route::post('/packagename/{id}', [PackageController::class, 'packagenameupdate']);
Route::delete('/packagename/{id}', [PackageController::class, 'packagenamedestroy']);
Route::post('/purchase/bulk-upload-csv', [PurchaseController::class, 'bulkUploadCSV']);

// products details route
Route::get('/stockDetails', [OrderController::class, 'stockDetails']);

//all report here
Route::get('categoryrate',[ReportController::class,'CategoryRatereport']);
Route::get('productReportSales',[ReportController::class,'productReportOnSale']);
Route::get('billingPurchase',[ReportController::class,'billingReportOnPurchase']);
Route::get('gstReport',[ReportController::class,'gstReport']);
Route::get('barcodeReport',[ReportController::class,'barcodeReport']);
Route::get('salesRegisterReport',[ReportController::class,'salesRegisterReport']);
Route::get('cashreport',[ReportController::class,'cashreport']);
Route::get('salesreport',[ReportController::class,'salesReport']);
Route::get('agentsalesreport',[ReportController::class,'agentsalesReport']);
Route::get('partyreport',[ReportController::class,'partywisePurchaseReport']);
//gsdt for demo
Route::get('gstReportDemo', [ReportController::class, 'gstReportDemo']);
Route::get('agentReport', [ReportController::class, 'agentReport']);

Route::post('/kot-orders', [KotOrderController::class, 'store']);
Route::get('/kot/{id}/bill', [KotOrderController::class, 'showBill']);
Route::post('/kot-orders/bill', [KotOrderController::class, 'getBillByTableNumber']);




 Route::post('/book-family-tables', [familyBookingController::class, 'bookFamilyTableWithItems']);
  Route::put('/update-family-tables', [familyBookingController::class, 'updateFamilyTableWithItems']);

Route::get('/check-family-bookings', [familyBookingController::class, 'getBookings']);
Route::post('/create-family-kot', [familyBookingController::class, 'createFamilyKot']);
Route::get('/get-family-kot/{bookingId}', [familyBookingController::class, 'getFamilyBookingKot']);
Route::post('/family-booking/{id}/generate-bill', [familyBookingController::class, 'generateFamilyBookingBill']);
Route::get('/customers/get/{id}', action: [CustomerController::class, 'show']); // Fetch all customers
//report for kot
Route::get('/kot-billing',[familyBookingController::class,'getAllFamilyBookingKotReports']);

Route::get('/famliy-billings',[familyBookingController::class,'generateFamilyBookingBillreport']);



Route::get('/kot-tables', [KotTableController::class, 'index']);
Route::post('/kot-tables', [KotTableController::class, 'store']);
Route::delete('/kot-tables/{id}', [KotTableController::class, 'destroy']);




Route::post('/parcel-order', [ParcelOrderController::class, 'storeParcelOrder']);
Route::post('/parcel-order/{id}/generate-bill', [ParcelOrderController::class, 'generateBill']);
Route::get('/parcel-kot/{parcel_order_id}', [ParcelOrderController::class, 'getParcelKOT']);

//parcel report 
Route::get('/parcel-kot-report',[ParcelOrderController::class,'ParcelKOTReport']);
Route::get('/parcel-bills',[ParcelOrderController::class,'generateBillReport']);
Route::get('/parcel-billReport',[ParcelOrderController::class,'ParcelBillreportPrint']);
Route::get('/parcel-billReport/{id}',[ParcelOrderController::class,'ParcelBillreportPrintId']);



Route::get('/parcel-types', [ParcelTypeController::class, 'index']);
Route::post('/parcel-types', [ParcelTypeController::class, 'store']);
Route::get('/parcel-types/{id}', [ParcelTypeController::class, 'show']);
Route::put('/parcel-types/{id}', [ParcelTypeController::class, 'update']);
Route::delete('/parcel-types/{id}', [ParcelTypeController::class, 'destroy']);



Route::post('bblc',[SmsSettingController::class,'store']);


Route::get('/sms-settings', [SmsSettingController::class, 'index']);
    Route::post('/sms-settings', [SmsSettingController::class, 'store']);
    Route::put('/sms-settings/{id}', [SmsSettingController::class, 'update']);
    Route::delete('/sms-settings/{id}', [SmsSettingController::class, 'destroy']);
