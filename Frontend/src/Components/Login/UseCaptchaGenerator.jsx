import React, { useEffect, useState } from "react";
import ProjectApiList from "../api/ProjectApiList";
import axios from "axios";
import CryptoJS from "crypto-js";

const { api_captcha } = ProjectApiList();

function decryptCaptcha(encryptedCaptcha) {
    const secretKey = "c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7e";

    const key = CryptoJS.enc.Latin1.parse(
        CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Latin1)
    );

    const ivString = CryptoJS.SHA256(secretKey).toString().substring(0, 16);
    const iv = CryptoJS.enc.Latin1.parse(ivString);

    const decrypted = CryptoJS.AES.decrypt(encryptedCaptcha, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

function encryptCaptcha(plainCaptcha) {
    const secretKey = "c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7e";

    const key = CryptoJS.enc.Latin1.parse(
        CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Latin1)
    );

    const ivString = CryptoJS.SHA256(secretKey).toString().substring(0, 16);
    const iv = CryptoJS.enc.Latin1.parse(ivString);

    const encrypted = CryptoJS.AES.encrypt(plainCaptcha, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

const UseCaptchaGenerator = () => {
    const [captchaData, setCaptchaData] = useState({ captcha_id: "", captcha_code: "" });
    const [captchaImage, setCaptchaImage] = useState("");
    const [decryptedCaptcha, setDecryptedCaptcha] = useState("");

    const generateRandomCaptcha = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_AUTH_URL}/login-Captcha`, {}, {
                headers: { Accept: "application/json" }
            });

            if (response.data.status) {
                const decrypted = decryptCaptcha(response.data.data.captcha_code);
                setCaptchaData({
                    captcha_id: response.data.data.captcha_id,
                    captcha_code: response.data.data.captcha_code
                });
                setDecryptedCaptcha(decrypted);
                drawCaptcha(decrypted);
            }
        } catch (error) {
            console.error("Error fetching captcha:", error);
        }
    };

    useEffect(() => {
        generateRandomCaptcha();
    }, []);

    const drawCaptcha = (captchaText) => {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 70;
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#E3F2FD";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add noise
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.bezierCurveTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.strokeStyle = `rgba(0, 0, 0, 0.3)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw text
        ctx.font = "bold 30px Arial";
        for (let i = 0; i < captchaText.length; i++) {
            ctx.save();
            const x = 20 + i * 30;
            const y = 40 + Math.random() * 10;
            const angle = (Math.random() - 0.5) * 0.6;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.9 + 0.1})`;
            ctx.fillText(captchaText[i], 0, 0);
            ctx.restore();
        }

        // Set image
        setCaptchaImage(canvas.toDataURL());
    };

    const getCaptchaData = () => captchaData;

    const getEncryptedCaptcha = (userInput) => encryptCaptcha(userInput);

    // ✅ Updated to accept plain props instead of Formik
    const captchaInputField = ({ value, onChange }) => (
        <div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                autoComplete="off"
                spellCheck="false"
                className="w-full p-2 border rounded"
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                placeholder="Enter Captcha"
            />
        </div>
    );

    return {
        captchaInputField,
        captchaImage,
        generateRandomCaptcha,
        getCaptchaData,
        getEncryptedCaptcha,
    };
};

export default UseCaptchaGenerator;
