import React, { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

const Payment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
  const sendPDF = async () => {
    if (paymentSuccess && paymentDetails && invoiceRef.current) {
      // Wait a short time to ensure invoice is rendered
      await new Promise(res => setTimeout(res, 300));
      const pdfBase64 = await html2pdf().from(invoiceRef.current).outputPdf('datauristring');
      const base64String = pdfBase64.split(',')[1];

      await axios.post('http://localhost:5000/api/payment/send-email', {
        to_email: 'srikar.13j@gmail.com',
        transaction_id: paymentDetails.id || 'N/A',
        amount: paymentDetails.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '10.00',
        status: paymentDetails.status || 'Completed',
        date: new Date().toLocaleDateString(),
        pdf: base64String
      });
    }
  };
  sendPDF();
}, [paymentSuccess, paymentDetails]);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://www.paypal.com/sdk/js?client-id=ARDxx3c_KY1NcmN2ASvrKE_6ARJNwCp5cFIF4vK1jrff0VscuXPQRC4O1jV8wnsQbyoHvQrRWKZLlMBp";
    
    script.addEventListener("load", () => {
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            setLoading(true);
            setError(null);

            const res = await axios.post("http://localhost:5000/api/payment/create-order", { amount: 10 });

            const data = res.data;
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
    const res = await axios.post(`http://localhost:5000/api/payment/capture-order/${data.orderID}`);
    const details = res.data;
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
          <div ref={invoiceRef} style={{
            maxWidth: "600px",
            margin: "32px auto",
            marginTop: "32px",
            background: "#f9fafb",
            color: "#1f2937",
            borderRadius: "16px",
            boxShadow: "0 2px 8px #e0e7ef",
            border: "1px solid #e5e7eb",
            fontFamily: "sans-serif",
            overflow: "hidden"
          }}>
            {/* Header with logo and org info */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)", padding: "24px", borderBottom: "4px solid #1e40af" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="https://www.iwcwtministry.org/wp-content/uploads/2021/11/iwcwtlogo.png" alt="IWCWT Logo" style={{ width: "64px", height: "64px", borderRadius: "8px", background: "#fff", padding: "4px", marginRight: "20px", boxShadow: "0 2px 8px #e0e7ef" }} />
                <div>
                  <div style={{ color: "#fff", fontWeight: "bold", fontSize: "2rem", letterSpacing: "1px" }}>DONATION INVOICE</div>
                  <div style={{ color: "#dbeafe", fontSize: "1rem", fontWeight: "500" }}>Child Welfare & Education</div>
                </div>
              </div>
              <div style={{ textAlign: "right", color: "#fff" }}>
                <div style={{ fontWeight: "600", fontSize: "1.125rem" }}>IWCWT Ministry</div>
                <div style={{ fontSize: "0.875rem" }}>info@iwcwtministry.org</div>
                <div style={{ fontSize: "0.875rem" }}>India</div>
              </div>
            </div>

            {/* Donor & Invoice Meta */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "24px 32px 0 32px", background: "#fff" }}>
              <div>
                <div style={{ color: "#6b7280", fontWeight: "500", fontSize: "0.875rem" }}>Donor</div>
                <div style={{ fontWeight: "600", fontSize: "1rem", marginTop: "4px" }}>John Doe</div>
                <div style={{ fontSize: "0.875rem" }}>sb-kqsfq43674007@personal.example.com</div>
                <div style={{ fontSize: "0.875rem" }}>US</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#6b7280", fontWeight: "500", fontSize: "0.875rem" }}>Invoice #</div>
                <div style={{ fontWeight: "600", fontSize: "1rem", marginTop: "4px" }}>{paymentDetails?.id?.slice(-8) || 'N/A'}</div>
                <div style={{ color: "#6b7280", fontWeight: "500", fontSize: "0.875rem", marginTop: "12px" }}>Date</div>
                <div style={{ fontWeight: "600", fontSize: "1rem", marginTop: "4px" }}>{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Table for donation details */}
            <div style={{ background: "#fff", padding: "0 32px" }}>
              <table style={{ width: "100%", marginTop: "24px", marginBottom: "8px", fontSize: "1rem", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#eff6ff" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "#1d4ed8", borderBottom: "1px solid #dbeafe" }}>Purpose</th>
                    <th style={{ textAlign: "right", padding: "12px 8px", fontWeight: 600, color: "#1d4ed8", borderBottom: "1px solid #dbeafe" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#f9fafb" }}>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #e5e7eb" }}>Child Welfare & Education Donation</td>
                    <td style={{ textAlign: "right", padding: "12px 8px", borderBottom: "1px solid #e5e7eb" }}>$10.00 USD</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold", background: "#eff6ff", borderTop: "1px solid #dbeafe" }}>Total:</td>
                    <td style={{ textAlign: "right", padding: "12px 8px", fontWeight: "bold", background: "#eff6ff", borderTop: "1px solid #dbeafe" }}>$10.00 USD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Transaction details and payment method */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "8px 32px 4px 32px", fontSize: "0.95rem" }}>
              <div>
                <div><span style={{ fontWeight: "600" }}>Transaction ID:</span> {paymentDetails?.id || 'N/A'}</div>
                <div><span style={{ fontWeight: "600" }}>Status:</span> {paymentDetails?.status || 'Completed'}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#6b7280", fontWeight: "500" }}>Payment Method</div>
                <div style={{ fontWeight: "600", color: "#1d4ed8" }}>PayPal</div>
              </div>
            </div>

            {/* Thank you and note */}
            <div style={{ background: "#eff6ff", padding: "20px 32px", borderRadius: "0 0 16px 16px", marginTop: "8px", color: "#1e293b", textAlign: "center" }}>
              <div style={{ fontWeight: "600", fontSize: "1.125rem", color: "#1d4ed8", marginBottom: "8px" }}>Thank you for your generous donation!</div>
              <div style={{ fontStyle: "italic", fontSize: "0.95rem" }}>This receipt confirms your donation for child welfare and education. No goods or services were provided in exchange for this contribution.</div>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
          >
            📄 Download PDF Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;