import { useEffect, useState } from 'react'
import anonLogo from '/anon.png'
import './App.css'



interface ObjectViewerProps {
  data: any;
}

const containerStyle: React.CSSProperties = {
};

const objectStyle: React.CSSProperties = {
  marginBottom: '8px',
};

const nestedObjectStyle: React.CSSProperties = {

};

const propertyStyle: React.CSSProperties = {
  marginBottom: '4px',
};




const ObjectViewer: React.FC<ObjectViewerProps> = ({ data }) => {
  const renderObject = (obj: any) => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} style={objectStyle}>
            <strong>{key}:</strong>
            <div style={nestedObjectStyle}>{renderObject(value)}</div>
          </div>
        );
      } else {
        return (
          <div key={key} style={propertyStyle}>
            <strong>{key}:</strong> {value?.toString()}
          </div>
        );
      }
    });
  };

  return <div style={containerStyle}>{renderObject(data)}</div>;
};














function App() {

  const [userData, setUserData] = useState<null|{[k:string]:any}>(null)
  const [ip, setIp] = useState<string | null>(null);
  const [geo, setGeo] = useState<null|{[k:string]:any}>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  const fetchIP = async () => {
    try {

      const getIP = await fetch('https://api.ipify.org?format=json',{
        headers:{
          accept:'application/json',
        }
      })

     if(getIP.status !== 200){
      throw new Error('get IP Error: '+getIP.statusText)
     }

     const idData = await getIP.json()

     if(!idData?.ip){
      throw new Error('get IP Error: '+JSON.stringify(idData))
     }

     const {ip} = idData


     setIp(ip)

     const getGeo = await fetch(`https://api.geoapify.com/v1/ipinfo?&ip=${ip}&apiKey=b8568cb9afc64fad861a69edbddb2658`,{
      headers:{
        accept:'application/json',
        'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
      }
     })

     const geoData = await getGeo.json()

     if(geoData?.message){
      throw new Error('get GEO IP Error: '+geoData?.message)
     }

     //@ts-ignore
     const {state,country} = geoData

     const geo = {
      iso_code:country?.iso_code,
      country:country?.name,
      state:state?.name
     }


     setGeo(geo)

    } catch (err) {

      const error = (err as Error).message
      setError(error)

    }finally{
      setLoading(false)
    }
  }


  useEffect(() =>{

    fetchIP()

    // const {
    //     allows_write_to_pm,
    //     first_name,
    //     id,
    //     is_premium,
    //     language_code,
    //     last_name,
    //     username,    //@ts-ignore
    //         } = window.Telegram.WebApp.initDataUnsafe.user


    const {Telegram} = window as any

    if(!Telegram){
      return
    }

    console.log('Telegram',Telegram)

    //@ts-ignore
    const {initDataUnsafe, platform} = Telegram.WebApp

    const {user} = initDataUnsafe

    if(!user){
      return
    }
      setUserData({...user,platform})
  },[])





  return (
    <>
          <div>
          <img src={anonLogo} className="logo" alt="logo" />      
      </div>
      <h2 style={{margin:0,padding:0}}>Gotcha!</h2>
      <div className="card">      
    
          <code>
           {
            userData &&  <ObjectViewer data={userData} />
           }
          {
            loading ? <>Loading...</>
                    : <>IP: {ip}</>
          }
          {
            geo &&  <ObjectViewer data={geo} />
          }
                    </code>
          {
            error &&  <p className="read-the-docs">{error}</p>
          }
     
      </div>
      <p className="read-the-docs">
      </p>
    </>
  )
}

export default App
