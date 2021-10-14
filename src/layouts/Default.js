import React from "react";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { authenticationService } from "../services/authenticationService";

function DefaultLayout (){
    const history = useHistory()
    useEffect(()=>{
		authenticationService.authorize()
		.catch( res => {
            history.push('/login')
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
    
    return(
    <div/>
    )
};

export default DefaultLayout;