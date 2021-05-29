/**
 * 
 * @param str String to capitalise
 * @returns Capitalised string
 */
export function capitaliseString(str: string): string|undefined {
    if(!!str){
        return str[0].toUpperCase() + str.substring(1).toLowerCase();
    }else{
        return undefined;
    }
}
