const serviceTemplate = (service) => {
  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        font-size: 12px;
        color: #000;
      }

      .title {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }

      .row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .box {
        width: 48%;
        border: 1px solid #000;
        padding: 10px;
        min-height: 80px;
      }

      .section-title {
        font-weight: bold;
        margin-bottom: 5px;
        text-decoration: underline;
      }

      .info {
        margin-bottom: 15px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }

      table th {
        background: #eaeaea;
        font-weight: bold;
      }

      table th, table td {
        border: 1px solid #000;
        padding: 6px;
        text-align: center;
      }

      .totals {
        width: 300px;
        margin-top: 20px;
        margin-left: auto;
        border: 1px solid #000;
      }

      .totals td {
        padding: 8px;
        border-bottom: 1px solid #000;
      }

      .totals tr:last-child td {
        font-weight: bold;
      }

      .footer {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
      }

      .signature {
        width: 200px;
        text-align: center;
        border-top: 1px solid #000;
        padding-top: 5px;
      }
    </style>
  </head>

  <body>

    <div class="title">SERVICE REPORT / INVOICE</div>

    <div class="info">
      <b>Service ID:</b> ${service._id} <br/>
      <b>Status:</b> ${service.status} <br/>
      <b>Date:</b> ${new Date(service.createdAt).toDateString()} <br/>
      <b>Problem:</b> ${service.problemDescription}
    </div>

    <div class="row">
      <div class="box">
        <div class="section-title">Customer</div>
        Name: ${service.customerId.name}
      </div>

      <div class="box">
        <div class="section-title">Technician</div>
        Name: ${service.technicianId.name}
      </div>
    </div>

    <table>
      <tr>
        <th>Sr No</th>
        <th>Part Name</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>

      ${service.parts.map((p, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${p.partId.partName}</td>
          <td>${p.quantity}</td>
          <td>${p.price}</td>
          <td>${p.total}</td>
        </tr>
      `).join("")}
    </table>

    <table class="totals">
      <tr>
        <td>Parts Total</td>
        <td>${service.partsTotal}</td>
      </tr>
      <tr>
        <td>Service Charge</td>
        <td>${service.serviceCharge}</td>
      </tr>
      <tr>
        <td>Grand Total</td>
        <td>${service.grandTotal}</td>
      </tr>
    </table>

    <div class="footer">
      <div class="signature">Customer Signature</div>
      <div class="signature">Authorized Signature</div>
    </div>

  </body>
  </html>
  `;
};

module.exports = serviceTemplate;