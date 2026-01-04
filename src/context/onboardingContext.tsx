'use client'

import { createContext , useContext , useState} from "react";


type OnboardingDetails = {
    semesterName : string ;
    semesterStartDate : Date | string ; // Can be Date or ISO string for serialization
    semesterEndDate : Date | string ; // Can be Date or ISO string for serialization
    subjectName : string ;
    subjectDescription : string ;
    subjectPriority : number ;
}

type OnboardingContextType = {
    onboardingDetails: OnboardingDetails | undefined;
    setOnboardingDetails: React.Dispatch<
      React.SetStateAction<OnboardingDetails | undefined>
    >;
};

  

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [onboardingDetails, setOnboardingDetails] = useState<OnboardingDetails | undefined>(undefined);
    return (
        <OnboardingContext.Provider value={{ onboardingDetails, setOnboardingDetails }}>
            {children}
        </OnboardingContext.Provider>
    )
}


export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}