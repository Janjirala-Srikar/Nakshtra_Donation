import React, { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const Payment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://www.paypal.com/sdk/js?client-id=ARDxx3c_KY1NcmN2ASvrKE_6ARJNwCp5cFIF4vK1jrff0VscuXPQRC4O1jV8wnsQbyoHvQrRWKZLlMBp";
    
    script.addEventListener("load", () => {
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            setLoading(true);
            setError(null);

            const res = await fetch("http://localhost:5000/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: 10 })
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data.id;
          } catch (error) {
            setError(`Failed to create order: ${error.message}`);
            throw error;
          } finally {
            setLoading(false);
          }
        },

        onApprove: async (data) => {
          try {
            setLoading(true);

            const res = await fetch(`http://localhost:5000/capture-order/${data.orderID}`, {
              method: "POST"
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const details = await res.json();
            setPaymentSuccess(true);
            setPaymentDetails(details);
          } catch (error) {
            setError(`Payment failed: ${error.message}`);
          } finally {
            setLoading(false);
          }
        },

        onError: (err) => {
          setError("PayPal button error occurred");
        }
      }).render("#paypal-button-container");
    });

    script.addEventListener("error", () => setError("Failed to load PayPal SDK"));

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const downloadPDF = () => {
    const element = invoiceRef.current;
    html2pdf().set({
      margin: 1,
      filename: 'donation_invoice.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save();
  };

  return (
    <div style={{ padding: "50px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Pay Me for Freelancing Work</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "20px", padding: "10px", border: "1px solid red", borderRadius: "4px" }}>
          ❌ {error}
        </div>
      )}

      {loading && (
        <div style={{ color: "blue", marginBottom: "20px" }}>
          ⏳ Processing...
        </div>
      )}

      {!paymentSuccess ? (
        <div id="paypal-button-container"></div>
      ) : (
        <div style={{ color: "green", textAlign: "center", padding: "20px" }}>
          <h3>✅ Payment Successful!</h3>
          <p>Thank you for your payment!</p>

          {/* Invoice UI */}
          <div ref={invoiceRef} className="max-w-xl mx-auto mt-8 bg-gray-50 text-gray-800 rounded-2xl shadow-2xl border border-gray-200 font-sans overflow-hidden">
            {/* Header with logo and org info */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 border-b-4 border-blue-800">
              <div className="flex items-center">
                <img src="https://www.iwcwtministry.org/wp-content/uploads/2021/11/iwcwtlogo.png" alt="IWCWT Logo" className="w-16 h-16 rounded-lg bg-white p-1 mr-5 shadow" />
                <div>
                  <div className="text-white font-bold text-2xl tracking-wide">DONATION INVOICE</div>
                  <div className="text-blue-100 text-base font-medium">Child Welfare & Education</div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="font-semibold text-lg">IWCWT Ministry</div>
                <div className="text-sm">info@iwcwtministry.org</div>
                <div className="text-sm">India</div>
              </div>
            </div>

            {/* Donor & Invoice Meta */}
            <div className="flex justify-between px-8 pt-6 bg-white">
              <div>
                <div className="text-gray-500 font-medium text-sm">Donor</div>
                <div className="font-semibold text-base mt-1">John Doe</div>
                <div className="text-sm">sb-kqsfq43674007@personal.example.com</div>
                <div className="text-sm">US</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 font-medium text-sm">Invoice #</div>
                <div className="font-semibold text-base mt-1">{paymentDetails?.id?.slice(-8) || 'N/A'}</div>
                <div className="text-gray-500 font-medium text-sm mt-3">Date</div>
                <div className="font-semibold text-base mt-1">{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Table for donation details */}
            <div className="bg-white px-8">
              <table className="w-full mt-6 mb-2 text-base">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="text-left py-3 px-2 font-semibold text-blue-700 border-b border-blue-100">Purpose</th>
                    <th className="text-right py-3 px-2 font-semibold text-blue-700 border-b border-blue-100">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-gray-50 even:bg-white">
                    <td className="py-3 px-2 border-b border-gray-100">Child Welfare & Education Donation</td>
                    <td className="text-right py-3 px-2 border-b border-gray-100">$10.00 USD</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-3 px-2 text-right font-bold bg-blue-50 border-t border-blue-100">Total:</td>
                    <td className="text-right py-3 px-2 font-bold bg-blue-50 border-t border-blue-100">$10.00 USD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Transaction details and payment method */}
            <div className="flex justify-between items-center bg-white px-8 pt-2 pb-1 text-sm">
              <div>
                <div><span className="font-semibold">Transaction ID:</span> {paymentDetails?.id || 'N/A'}</div>
                <div><span className="font-semibold">Status:</span> {paymentDetails?.status || 'Completed'}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 font-medium">Payment Method</div>
                <div className="font-semibold text-blue-700">PayPal</div>
              </div>
            </div>

            {/* Thank you and note */}
            <div className="bg-blue-50 px-8 py-5 rounded-b-2xl mt-2 text-gray-700 text-center">
              <div className="font-semibold text-lg text-blue-700 mb-1">Thank you for your generous donation!</div>
              <div className="italic text-sm">This receipt confirms your donation for child welfare and education. No goods or services were provided in exchange for this contribution.</div>
            </div>
          </div>

          <button onClick={downloadPDF} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
            📄 Download PDF Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;