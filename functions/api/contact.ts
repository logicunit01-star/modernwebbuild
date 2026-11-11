interface Env {
  HUBSPOT_PORTAL_ID?: string;
  HUBSPOT_FORM_GUID?: string;
  HUBSPOT_FORM_ID?: string;
  HUBSPOT_ACCESS_TOKEN?: string;
  RESEND_API_KEY?: string;
  CONTACT_NOTIFICATION_EMAIL?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    const { name, email, subject, message, hutk } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid name (at least 2 characters)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Please provide a subject (at least 3 characters)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide a message with at least 10 characters." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hubspotPortalId = context.env.HUBSPOT_PORTAL_ID || "246175508";
    const hubspotFormGuid =
      context.env.HUBSPOT_FORM_GUID || context.env.HUBSPOT_FORM_ID;
    const hubspotAccessToken = context.env.HUBSPOT_ACCESS_TOKEN;

    const nameParts = (name as string).trim().split(/\s+/);
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "";

    // 1. Submit to HubSpot Forms API v3 (if Form GUID is configured)
    if (hubspotPortalId && hubspotFormGuid) {
      try {
        await fetch(
          `https://api-na2.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormGuid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
                pageUri: "https://modernwebbuild.com/contact",
                pageName: "Contact Us",
              },
            }),
          }
        );
      } catch (hsErr) {
        console.error("[HubSpot Forms API Error]", hsErr);
      }
    }

    // 2. Submit to HubSpot CRM Contacts API (if Private App Token is configured)
    if (hubspotAccessToken) {
      try {
        await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
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
      } catch (crmErr) {
        console.error("[HubSpot CRM API Error]", crmErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Thank you for contacting us. Your message has been received and our editorial team will get back to you shortly.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Contact Function Error]", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred while processing your request. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
