import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "../ui/button";

interface CustomButtonProps {
    className?: string
    children: ReactNode;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export default function CustomButton({children, className, type = 'button'}: CustomButtonProps){
    return (
        <Button className={className} type={type}>
            {children}
        </Button>
    )
}