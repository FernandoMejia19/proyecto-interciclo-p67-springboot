export interface Usuario{
    id:number;
    nombre:string;
    ciudad:string;
    pais:string;
    descripcion:string;
    facebook:string
    linkedin:string
    celular:string
    github:string
    email:string
    rol:string
    foto:string
}
export interface Asesoria{
    id:number;
    fecha:string;
    programador:number
}

export interface HoraAsesoria{
    id:number;
    hora:string;
    reservador:string;
    asesoria:number;
}

export interface Proyecto{
    id:number;
    titulo:string;
    descripcion:string;
    imagen:string;
    linkRepo:string;
    programador:Usuario;
    fecha:string;
}

export interface ReservaAsesoria{
    id:number;
    motivo:string;
    estado:string;
    asesoria:number;
    horaAsesoria:number;
    solicitante:number;
    programador:number;
}


export interface Tecnologia{
    id:number;
    nombre:string;
}

export interface TecnolgiaProyecto{
    id:number;
    proyecto:number;
    tecnologia:number;
}
export interface UsuarioTecnologia{
    idUsuTecnologia:number;
    usuario:number;
    tecnologia:number;

}