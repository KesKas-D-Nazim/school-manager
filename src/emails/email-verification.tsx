

import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import type { FC } from "react";

interface EmailVerificationTemplateProps {
    name: string;
    verificationUrl?: string;
    appName?: string;
    expiresInMinutes?: number;
    supportEmail?: string;
}

export const EmailVerificationTemplate: FC<
    Readonly<EmailVerificationTemplateProps>
> = ({
    name,
    verificationUrl,
    appName = "edoManage",
    expiresInMinutes = 15,
    supportEmail = "support@edomanage.com",
}) => {
    const safeVerificationUrl =
        verificationUrl ?? "https://edomanage.app/verify-email";
    const timerLabel = `${String(expiresInMinutes).padStart(2, "0")}:00`;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const expiresAtLabel = `${new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
    }).format(expiresAt)} UTC`;

    return (
        <Html>
            <Head />
            <Preview>Verify your email to finish setting up your account.</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                edoPrimary: "#135bec",
                                edoBgLight: "#f6f6f8",
                                edoCard: "#ffffff",
                                edoBorder: "#e2e8f0",
                                edoHeading: "#101622",
                                edoBody: "#334155",
                                edoMuted: "#64748b",
                                edoBadgeBg: "#e7efff",
                            },
                            fontFamily: {
                                lexend: [
                                    "Lexend",
                                    "-apple-system",
                                    "BlinkMacSystemFont",
                                    "Segoe UI",
                                    "sans-serif",
                                ],
                            },
                        },
                    },
                }}
            >
                <Body className="mx-auto bg-edoBgLight px-4 py-10 font-lexend">
                    <Container className="mx-auto max-w-[560px] rounded-xl border border-edoBorder bg-edoCard px-6 py-7 shadow-[0_8px_24px_rgba(16,22,34,0.08)]">
                        <Section className="mb-5">
                            <Text className="m-0 inline-block rounded-full bg-edoBadgeBg px-3 py-1 text-xs font-bold tracking-[0.2px] text-edoPrimary">
                                {appName}
                            </Text>
                        </Section>

                        <Heading className="m-0 mb-4 text-[28px] font-bold leading-[1.2] tracking-[-0.4px] text-edoHeading">
                            Confirm your email address
                        </Heading>

                        <Text className="m-0 mb-[14px] text-base leading-[1.6] text-edoBody">
                            Hi {name},
                        </Text>

                        <Text className="m-0 mb-[14px] text-base leading-[1.6] text-edoBody">
                            Thanks for signing up. Please verify your email to activate
                            your account and continue.
                        </Text>

                        <Section className="my-[26px] mb-[18px]">
                            <Button
                                href={safeVerificationUrl}
                                className="inline-block rounded-lg bg-edoPrimary px-5 py-3 text-[15px] font-semibold text-white no-underline"
                            >
                                Verify Email
                            </Button>
                        </Section>


                        <Text className="m-0 mb-[10px] text-[13px] leading-[1.6] text-edoMuted">
                            This verification link expires in {expiresInMinutes} minutes.
                        </Text>

                        <Text className="m-0 mb-[10px] text-[13px] leading-[1.6] text-edoMuted">
                            Expires at: {expiresAtLabel}
                        </Text>

                        <Text className="m-0 mb-[10px] text-[13px] leading-[1.6] text-edoMuted">
                            If the button does not work, copy and paste this link into
                            your browser:
                        </Text>

                        <Link
                            href={safeVerificationUrl}
                            className="break-all text-[13px] leading-[1.5] text-edoPrimary"
                        >
                            {safeVerificationUrl}
                        </Link>

                        <Hr className="my-6 border-edoBorder" />

                        <Text className="m-0 mb-2 text-xs leading-[1.5] text-edoMuted">
                            If you did not create an account, you can ignore this email.
                        </Text>
                        <Text className="m-0 mb-2 text-xs leading-[1.5] text-edoMuted">
                            Need help? Contact us at{" "}
                            <Link href={`mailto:${supportEmail}`} className="text-edoPrimary">
                                {supportEmail}
                            </Link>
                            .
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};