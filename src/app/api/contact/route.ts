import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, hutk } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a subject (at least 3 characters)." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a message with at least 10 characters." },
        { status: 400 }
      );
    }

    // Forward lead to HubSpot
    const hubspotPortalId =
      process.env.HUBSPOT_PORTAL_ID ||
      process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ||
      "246175508";
    const hubspotFormGuid =
      process.env.HUBSPOT_FORM_GUID || process.env.HUBSPOT_FORM_ID;
    const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    const nameParts = (name as string).trim().split(/\s+/);
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "";

    // 1. Submit to HubSpot Forms API v3 (if Form GUID is configured)
    if (hubspotPortalId && hubspotFormGuid) {
      try {
        const hsResponse = await fetch(
          `https://api-na2.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormGuid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: [
                { objectTypeId: "0-1", name: "email", value: email },
                { objectTypeId: "0-1", name: "firstname", value: firstName },
                { objectTypeId: "0-1", name: "lastname", value: lastName },
                { objectTypeId: "0-1", name: "subject", value: subject },
                { objectTypeId: "0-1", name: "message", value: message },
              ],
              context: {
                hutk: hutk || undefined,
                pageUri: `${process.env.NEXT_PUBLIC_SITE_DOMAIN || "https://modernwebbuild.com"}/contact`,
                pageName: "Contact Us",
              },
            }),
          }
        );
        if (!hsResponse.ok) {
          const errText = await hsResponse.text();
          console.error("[HubSpot Forms API Error]", errText);
        }
      } catch (hsErr) {
        console.error("[HubSpot Forms API Exception]", hsErr);
      }
    }

    // 2. Submit to HubSpot CRM Contacts API (if Private App Token is configured)
    if (hubspotAccessToken) {
      try {
        const crmResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hubspotAccessToken}`,
          },
          body: JSON.stringify({
            properties: {
              email,
              firstname: firstName,
              lastname: lastName,
              message: `[Subject: ${subject}]\n\n${message}`,
              hs_lead_status: "NEW",
            },
          }),
        });
        if (!crmResponse.ok) {
          const crmErrText = await crmResponse.text();
          console.error("[HubSpot CRM API Error]", crmErrText);
        }
      } catch (crmErr) {
        console.error("[HubSpot CRM API Exception]", crmErr);
      }
    }

    // Direct Resend API dispatch if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      "editorial@modernwebbuild.com";

    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Modernwebbuild <onboarding@resend.dev>",
            to: [recipientEmail],
            reply_to: email,
            subject: `[Contact] ${subject}`,
            text: `From: ${name} (${email})\n\nMessage:\n${message}`,
          }),
        });
      } catch (err) {
        console.error("Failed to forward contact email:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for contacting us. Your message has been received and our editorial team will get back to you shortly.",
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
