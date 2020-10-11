import React from 'react';
import ContentLoader from "react-content-loader";


const ProfileLoader = (props) => (
    <ContentLoader 
      speed={2}
      width={props.width}
      height={38}
      //viewBox="0 0 400 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
      style={{borderBottom: "2px solid #be6d85"}}
    >
      <rect x="4" y="8" rx="3" ry="3" width="75%" height="10"  /> 

    </ContentLoader>
  )

  export default ProfileLoader;