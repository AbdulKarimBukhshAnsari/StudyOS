import { OnboardingProvider } from "@/context/onboardingContext";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <OnboardingProvider>
            {children}
        </OnboardingProvider>
    )
}