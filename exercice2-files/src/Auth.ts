class Auth {
  private static header = {
    alg: "HS256",
    typ: "JWT",
  };

  public constructor(private secret: string) {}

  public generateJWT(payload: Record<string, any>): string {
    const encodedHeader = this.base64urlEncode(JSON.stringify(Auth.header));
    const encodedPayload = this.base64urlEncode(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const signature = this.hmacSHA256(unsignedToken);
    const encodedSignature = this.base64urlEncode(signature);

    return `${unsignedToken}.${encodedSignature}`;
  }

  private base64urlEncode(str: string): string {
    try {
      return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch (e) {
      return "";
    }
  }

  private hmacSHA256(message: string): string {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", this.secret);
    hmac.update(message);

    return hmac.digest("hex");
  }

  public verifyJWT(token: string): boolean | Record<string, any> {
    try {
      const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
      const unsignedToken = `${encodedHeader}.${encodedPayload}`;
      const signature = this.hmacSHA256(unsignedToken);
      const encodedExpectedSignature = this.base64urlEncode(signature);

      if (encodedSignature !== encodedExpectedSignature) {
        return false;
      }

      return JSON.parse(this.base64urlDecode(encodedPayload));
    } catch (e) {
      return false;
    }
  }

  private base64urlDecode(str: string): string {
    try {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }

      return atob(base64);
    } catch (e) {
      return "";
    }
  }
}

export default Auth;
