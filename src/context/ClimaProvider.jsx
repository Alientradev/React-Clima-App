import { useState, createContext} from 'react'
import axios from 'axios'

const ClimaContext = createContext()

const ClimaProvider = ({children}) => {

    const [busqueda, setBusqueda] = useState({
        ciudad: '',
        pais: ''
    })
    const [resultado, setResultado] = useState({})
    const [cargando, setCargando] = useState(false)
    const [noResultado, setNoResultado] = useState(false)

    const datosBusqueda = e => {
        setBusqueda({
            ...busqueda,
            [e.target.name]: e.target.value
        })
    }

    const consultarClima = async datos => {
        setCargando(true)
        setNoResultado(false)
        try {
            // Obtener la latitud y la longitud apartir de la ciudad y el pais
            const { ciudad, pais } = datos
            const appId = '6f93f5fc48e95a96b146558032e0e739'
            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${appId}`
            const {data} = await axios(url)
            //Obtener el clima en base a la latitud y la longitud
            const { lat, lon } = data[0]            
            const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
            const {data: clima} = await axios(urlClima)
            setResultado(clima)

        } catch (error) {
            setNoResultado('No se encontraron resultados en la busqueda')
        }finally{
            setCargando(false)
        }
    }

    return(
        
        <ClimaContext.Provider
            value={{
                busqueda,
                datosBusqueda,
                consultarClima,
                resultado,
                cargando,
                noResultado
            }}    
        >
            {children}
        </ClimaContext.Provider>
    )
}

export {
    ClimaProvider
}

export default ClimaContext