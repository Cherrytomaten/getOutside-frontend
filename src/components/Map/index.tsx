import dynamic from 'next/dynamic';


const Map = dynamic(() => import('./map'), {
  ssr: false,
});

// return(
//   <div>
// <Filters/>
// <Map/>
// </div>
// )


export default Map;
