import { hash, compare } from 'bcrypt';

export async function hashString(stringToHash: string): Promise<string>{
    return await hash(stringToHash, 10);
}

export async function compareStrings(stringToCompare: string, hashedString: string): Promise<boolean>{
    return await compare(stringToCompare, hashedString);
}