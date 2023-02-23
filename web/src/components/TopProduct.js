import { Divider, Grid } from "@mui/material";
import landscape from "../assets/landscape.png";

export default function TopProducts(props) {

    let data = ""
    let dataImg = landscape
    let dataDesc = 'loading...'

    //verify if there are data in the requisition
    if (!props.details) {
        return
    }
    //verfy if it is a null item
    else if (Array.isArray(props.details)) {
        data = props.details
        if (data.length > 0) { dataImg = props.details[0].pImg; dataDesc = props.details[0].pDesc }
    }


    return (
        <>
            <Divider />
            <Grid container className="ps-4" >
                <Grid item xs={2} height={50}><img className="" style={{ height: '50px' }} src={dataImg}></img></Grid>
                <Grid item xs={7} height={50}><small className="" >{dataDesc}</small></Grid>
                <Grid item xs={3} height={50}>
                    <Grid container>
                        <Grid item xs={12}><small className="" style={{ fontWeight: "bold" }} >{props.qty}</small></Grid>
                        <Grid item xs={12}><small className=""  >vendas</small></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}