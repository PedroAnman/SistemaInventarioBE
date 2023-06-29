//--------------------------Variables Generales--------------------------//

export enum COLLECTIONS {
    PRODUCTS = 'products'
}
export enum MESSAGE{
    TOKEN_VERIFICATION_FAILED = 'Token no valido, inicia sesion de nuevo',
    ERROR_PARAMETERS = 'Parámetros de entrada incorrectos'
}

//--------------------------Variables Fecha--------------------------//
export function GET_DATE(sumDays:number = 0, zone:string = 'Etc/GMT+6'){
    const d = new Date().toLocaleString('en-GB', {timeZone: zone});
    let parts = d.trim().replace(/,+(?= )/g,'').split(/[\s-\/:]/);
    let day = String(Number(parts[0]) + sumDays);
    if(day.length == 1){
        day = `0${day}`;
    }
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(`${parts[2]}-${parts[1]}-${day}T${parts[3]}:${parts[4]}:${parts[5]}.000-00:00`);
}