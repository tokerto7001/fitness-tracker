import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "../ui/button";

interface CustomButtonProps {
    className?: string
    children: ReactNode;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
    disabled?: boolean;
}

export default function CustomButton({children, className, type = 'button', disabled = false}: CustomButtonProps){
    return (
        <Button disabled={disabled} className={className} type={type}>
            {children}
        </Button>
    )
}