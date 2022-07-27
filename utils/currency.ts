




export const format = ( value: number ) => {

    //formateador
    const formateador = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    return formateador.format( value );

}