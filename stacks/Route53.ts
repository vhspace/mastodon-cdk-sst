import { StackContext } from "@serverless-stack/resources";
import {
  DnsValidatedCertificate,
  ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";

/**
 * Our DNS zones.
 */
export function Route53({ stack, app }: StackContext) {
  const zoneName = process.env.HOSTED_ZONE;
  if (!zoneName) throw new Error("HOSTED_ZONE is not set in .env");

  const hostedZone = new HostedZone(stack, "Zone", {
    zoneName,
  });

  // certificate (in our region)
  let certificateRegional: ICertificate | undefined,
    certificateGlobal: ICertificate | undefined;

  // request a certificate with ACM
  if (zoneName && hostedZone) {
    certificateRegional = new DnsValidatedCertificate(
      stack,
      "RegionalCertificate",
      {
        domainName: zoneName,
        hostedZone,
        subjectAlternativeNames: [`*.${zoneName}`],
      }
    );
    // cert in us-east-1, required for cloudfront, cognito, api gateway
    certificateGlobal =
      app.region === "us-east-1"
        ? //
          certificateRegional
        : new DnsValidatedCertificate(stack, "GlobalCertificate", {
            domainName: zoneName,

            hostedZone,
            subjectAlternativeNames: [`*.${zoneName}`],
            region: "us-east-1",
          });
  }

  return {
    hostedZone,
    certificateGlobal,
    certificateRegional,
    domainName: zoneName,
  };
}
