import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Say language="de-DE">Hallo! Dein KI Anruf ist jetzt aktiv. Drücke die 1 für Smalltalk, die 2 für eine kurze persönliche Nachricht.</Say>
  <Gather input="dtmf" timeout="6" numDigits="1">
    <Say language="de-DE">Bitte jetzt wählen.</Say>
  </Gather>
  <Say language="de-DE">Keine Eingabe erkannt. Wir spielen eine Standard Nachricht ab.</Say>
  <Pause length="1"/>
  <Say language="de-DE">Dies ist eine Demoversion. Für volle Interaktivität aktivieren wir Realtime demnächst.</Say>
</Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}
