 "use client"; // ✅ Ensure this is at the top
import { Suspense } from "react";
import ReviewForm from "./index";

export default function ReviewPage() {
    return (
        <Suspense fallback={<p>Loading review page...</p>}>
            <ReviewForm />
        </Suspense>
    );
}
