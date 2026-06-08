import path from "path";
import fs from "fs";

export const Header = () => {
  const logoPath = path.join(process.cwd(), "src", "assets", "Mecord_logo.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;
  return `
    <div class="header-container">
        <div class="header-content">
            <div class="logo-dash">____</div>
            <div class="logo">
                <img src="${logoSrc}" />
            </div>
            <div class="company-info">
                <div class="company-name">MECORD SYSTEMS & SERVICES PVT. LTD.</div>
                <div class="address">304 & 314, Hill View Industrial Estate, Amrut Nagar, Ghatkopar (West) Mumbai 400 086</div>
                <div class="contact-details">
                    Phone : +91-22-2500 8128 / 2500 7552 / 6245 0200 • Cell : 98200 34894 / 98210 31919<br>
                    E-mail : <a href="mailto:sales@mecord.com">sales@mecord.com</a> / <a href="mailto:service@mecord.com">service@mecord.com</a> • <a href="http://www.mecord.com">www.mecord.com</a><br>
                    CIN : U33100MH1987PTC042202 • GSTIN : 27AAACM8582E1ZB
                </div>
            </div>
        </div>
    </div>
    <style>
        .header-container {
            background: white;
            border-bottom: 3px solid red;
            width: 100%;
            height: 103px;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .header-content {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0 10px;
        }

        .logo-dash{
            font-weight: 600;
            margin-top: -17px;
            margin-right: 3px;
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-right: 15px;
        }

        .logo img {
            width: 160px;
            height: auto;
            max-height: 90px;
        }

        .company-info {
            flex: 1;
        }

        .company-name {
            font-family: 'Lora', serif;
            font-size: 20px;
            font-weight: bold;
            color: #000;
            /* margin-bottom: 4px; */
            letter-spacing: 0.5px;
        }

        .address {
            font-size: 11px;
            color: black;
            border-bottom: 2px solid black;
            margin-bottom: 5px;
        }

        .contact-details {
            font-size: 10px;
            color: #000000;
            line-height: 1.2;
        }

        .contact-details a {
            color: black;
            text-decoration: none;
        }

        .contact-details a:hover {
            text-decoration: underline;
        }
    </style>
    `;
};