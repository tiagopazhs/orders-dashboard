import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import NavBarSimple from "../components/NavBarSimple";
import StoreCard from "../components/StoreCard";
import SubNavBar from "../components/SubNavBar";
import TopProducts from "../components/TopProduct";
import PieOrder from "../components/PieOrder";
import '../styles.css';
import storeLogo1 from "../assets/chicago.png";
import storeLogo2 from "../assets/lakers.png";
import storeLogo3 from "../assets/boston.png";
import storeLogo4 from "../assets/NewYork.png";
import { optionsColumn, optionsTable, formattersTable } from "../constants/dashContants";
import defaultOrdersRequest from '../constants/defaultOrdersRequest.json';
import defaultProductsRequest from '../constants/defaultProductsRequest.json';
// @mui material components
import Grid from "@mui/material/Grid";
import { Alert, Box, Button, Typography } from "@mui/material";

const { findMax, removeListItem } = require("../utils");

//Ignore react gogle chart warms
const originalWarn = console.warn;
console.warn = function (...args) {
    const arg = args && args[0];
    if (arg && arg.includes('Attempting to load version \'51\' of Google Charts')) return;
    originalWarn(...args);
};

const moment = require('moment')
moment.locale('pt-br');

const url = "http://localhost:8500";
const token = "unavailable"

function Dash() {

    // Set variable that will be used to receive the get orders data and handle with alerts.
    const [currentProducts, setCurrentProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    // Set variable that will be used to receive  the get orders data.
    const [currentOrders, setCurrentOrders] = useState([]);
    const [listAtendidos, setListAtendidos] = useState([]);
    const [listAbertos, setListAbertos] = useState([]);
    const [ldgList, setLdgList] = useState([]);
    const [isList, setIsList] = useState([]);
    const [mrvList, setMrvList] = useState([]);
    const [tagList, setTagList] = useState([]);

    // Set chart transport variables
    const [transpInterlog, setTranspInterlog] = useState(0);
    const [transpMeLi, setTranspMeli] = useState(0);
    const [transpCorreios, setTranspCorreios] = useState(0);
    const [transpBike, setTranspBike] = useState(0);
    const [transpLocker, setTranspLocker] = useState(0);
    const [dataTableOpen, setDataTableOpen] = useState([["N order", "Store", "Customer", "Date", "Overdue days"], ["", "", "", "", ""]]);

    // Variables to use in the bigest selers items
    const [bigger1, setBigger1] = useState("");
    const [bigger2, setBigger2] = useState("");
    const [bigger3, setBigger3] = useState("");
    const [bigger4, setBigger4] = useState("");
    const [bigger5, setBigger5] = useState("");
    const [biggerQty1, setBiggerQty1] = useState("");
    const [biggerQty2, setBiggerQty2] = useState("");
    const [biggerQty3, setBiggerQty3] = useState("");
    const [biggerQty4, setBiggerQty4] = useState("");
    const [biggerQty5, setBiggerQty5] = useState("");

    // variable to update the updated time 
    const [updatedTime, setUpdatedTime] = useState("00:01")

    //update modal data chart
    let dataColumn = [
        ["Element", "Density", { role: "style" }, { role: "annotation" }],
        ["air", transpInterlog, "44bb83", transpInterlog],
        ["road", transpMeLi, "ececec", transpMeLi],
        ["maritime", transpCorreios, "344c5c", transpCorreios],
        ["rail", transpBike, "9cd4bc", transpBike],
        ["express", transpLocker, "bce4f0", transpLocker],
    ];

    //Requisition to get products
    async function getProduto() {
        if (token !== "unavailable") {
            let responseProdGet = await fetch(`${url}/produtos`);
            let products = await responseProdGet.json();
            setCurrentProducts(products)
        }
        else setCurrentProducts(defaultProductsRequest);
    }

    //Requisition to get orders
    async function getPedido() {
        if (token !== "unavailable") {
            let responseGet = await fetch(`${url}/pedidos`);
            let orders = await responseGet.json();
            setCurrentOrders(orders?.sort((a, b) => (a.pTempoAtraso < b.pTempoAtraso) ? 1 : ((b.pTempoAtraso < a.pTempoAtraso) ? -1 : 0)))
        }
        else setCurrentOrders(defaultOrdersRequest);
    }

    //Refresh values on the dashboard
    function refreshValues() {

        //filter orders that are not open
        const notOpen = ['Atendido', 'Devolvido', 'Cancelado']
        setListAtendidos(Array.isArray(currentOrders) ? currentOrders.filter(currentOrders => { return currentOrders.pStatus === 'Atendido' }) : [])
        setListAbertos(Array.isArray(currentOrders) ? currentOrders.filter(currentOrders => { return notOpen.indexOf(currentOrders.pStatus) === -1 }) : [])

        // Stores values
        setLdgList(Array.isArray(listAtendidos) ? listAtendidos.filter(listAtendidos => { return listAtendidos.pLoja === '203619239' }) : [])
        setIsList(Array.isArray(listAtendidos) ? listAtendidos.filter(listAtendidos => { return listAtendidos.pLoja === '203370950' }) : [])
        setMrvList(Array.isArray(listAtendidos) ? listAtendidos.filter(listAtendidos => { return listAtendidos.pLoja === '203994140' }) : [])
        setTagList(Array.isArray(listAtendidos) ? listAtendidos.filter(listAtendidos => { return listAtendidos.pLoja === '203619241' }) : [])

        // sended orders by mode
        let pedidosTranspInterlog = listAtendidos.filter(listAtendidos => { return listAtendidos.pTransportadora === 'Interlog' })
        setTranspInterlog(pedidosTranspInterlog.length)
        let pedidosTranspMeli = listAtendidos.filter(listAtendidos => { return listAtendidos.pTransportadora === 'vtex:fob_16dc0f6' })
        setTranspMeli(pedidosTranspMeli.length)
        let pedidosTranspCorreios = listAtendidos.filter(listAtendidos => { return listAtendidos.pTransportadora === 'correios' })
        setTranspCorreios(pedidosTranspCorreios.length)
        let pedidosTranspBike = listAtendidos.filter(listAtendidos => { return listAtendidos.pTransportadora === 'BIKE' })
        setTranspBike(pedidosTranspBike.length)
        let pedidosTranspLocker = listAtendidos.filter(listAtendidos => { return listAtendidos.pTransportadora === 'Clique e retire - Inter' })
        setTranspLocker(pedidosTranspLocker.length)

        // top 5 best selling products
        let listOfProducts = []
        let z = 0
        let y = 0
        let product = ""
        let newProduct = ""
        let qty = ""
        let img = ""
        let desc = ""
        let objIndex = 0

        //Create the products data to sort by top 4 best sellers
        while (z < listAtendidos.length) {
            while (y < listAtendidos[z].pItens.length) {
                product = listAtendidos[z].pItens[y].item.codigo
                desc = listAtendidos[z].pItens[y].item.descricao
                img = ""
                qty = parseInt(listAtendidos[z].pItens[y].item.quantidade)
                newProduct = [{ "item": product, "descricao": desc, "img": img, "qty": qty }]
                objIndex = listOfProducts.findIndex((obj => obj.item === product));
                if (objIndex === -1) {
                    Array.prototype.push.apply(listOfProducts, newProduct);
                } else {
                    listOfProducts[objIndex].qty = listOfProducts[objIndex].qty + qty
                }
                y++
            }
            y = 0
            z++
        }

        // refresh products data
        if (findMax(listOfProducts) != null && currentProducts != []) {

            listOfProducts = removeListItem(listOfProducts, "Personalização - Nome e Número") // remove item that are special
            let max1 = findMax(listOfProducts)
            setBigger1(currentProducts.filter(x => x.pCode === max1.item))
            setBiggerQty1(max1.qty)

            listOfProducts = removeListItem(listOfProducts, max1.item) // remove before item to find de second max
            let max2 = findMax(listOfProducts)
            setBigger2(currentProducts.filter(x => x.pCode === max2.item))
            setBiggerQty2(max2.qty)

            listOfProducts = removeListItem(listOfProducts, max2.item) // remove before item to find de third max
            let max3 = findMax(listOfProducts)
            setBigger3(currentProducts.filter(x => x.pCode === max3.item))
            setBiggerQty3(max3.qty)

            listOfProducts = removeListItem(listOfProducts, max3.item) // remove before item to find de for max
            let max4 = findMax(listOfProducts)
            setBigger4(currentProducts.filter(x => x.pCode === max4.item))
            setBiggerQty4(max4.qty)

            listOfProducts = removeListItem(listOfProducts, max4.item) // remove before item to find de for max
            let max5 = findMax(listOfProducts)
            setBigger5(currentProducts.filter(x => x.pCode === max5.item))
            setBiggerQty5(max5.qty)
        }

        // table of open orders
        const storesNumbers = ["203619239", "203370950", "203994140", "203619241"]
        const storesName = ["Shop Bulls", "Leakers Store", "Celtics Store", "Shop MSG"]
        let dataTable = [["N order", "Store", "Customer", "Date", "Overdue days"]]
        let dataTableResult = []
        let storeIndice = -1
        let aux = 0
        let currentOrder = []
        let dataTableAdd = []
        while (aux < listAbertos.length) {
            dataTableResult = []
            currentOrder = listAbertos[aux]
            storeIndice = storesNumbers.indexOf(currentOrder.pLoja)
            dataTableAdd = [
                currentOrder.pNumero,
                storesName[storeIndice],
                currentOrder.pCliente,
                moment(currentOrder.pDataCriacao).format("DD/MM"),
                currentOrder.pTempoAtraso
            ]
            dataTableResult = [...dataTable, [...dataTableAdd]]
            dataTable = dataTableResult
            aux++
        }

        setDataTableOpen(dataTable.length > 3 ? dataTable.sort((a, b) => b.last_nom - a.last_nom) : [["N order", "Store", "Customer", "Date", "Overdue days"], ["", "", "", "", ""]])

        // last update time
        setUpdatedTime(moment().format('h:mm a'))
    }

    // Handle the alert
    

    // function to get orders scheduled
    useEffect(() => {
        const myInterval = window.setInterval(function () {
            getPedido();
        }, 6000000); // repeat every 1 hour
        return () => clearInterval(myInterval);
    }, []);

    // check if the values are updated
    useEffect(() => {
        if (tagList.length === 0) refreshValues();
    }, [tagList]);

    // get data before to get started
    useEffect(() => {
        getProduto();
        getPedido();
        setTimeout(() => { refreshValues() }, 800);
        setTimeout(() => { setShowAlert(true) }, 7000);
    }, []);

    return (
        <div className="Dashboard" style={{ backgroundColor: "#F5F6FC" }}>
            <NavBarSimple />
            <Alert variant="outlined" severity="info" hidden={showAlert}
                action={
                    <Button color="inherit" size="small" onClick={() => setShowAlert(true)}>
                        UNDO
                    </Button>
                }>
                Provide a token to refresh data!
            </Alert>
            <div id="body" className="" style={{ backgroundColor: "#F5F6FC" }}>{/* "#F5F6FC" F07939*/}
                <SubNavBar updatedTime={updatedTime} />
                <Box id="lojas" sx={{ p: 4, pt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={3}>
                            <StoreCard logo={storeLogo1} backLogoColor={"#0f0909"} atualizarPedidos={ldgList} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <StoreCard logo={storeLogo2} backLogoColor={"#fbbb24"} atualizarPedidos={isList} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <StoreCard logo={storeLogo3} backLogoColor={"#67b494"} atualizarPedidos={mrvList} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <StoreCard logo={storeLogo4} backLogoColor={"#0b6bb2"} atualizarPedidos={tagList} />
                        </Grid>
                    </Grid>
                </Box>
                <Box id="bodyCharts" sx={{ p: 4, pt: 0 }}>
                    <Grid container spacing={4} >
                        <Grid id="leftCharts" item xs={12} md={12} lg={8} >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6} lg={6} >
                                    <PieOrder orders={listAtendidos} title={"Shipped orders"} desc={"pack on time"} />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                    <PieOrder orders={listAbertos} title={"Open orders"} desc={"orders on time"} />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                    <Box style={{ backgroundColor: 'white' }} height={300} sx={{ borderRadius: '10px', boxShadow: 2 }}>
                                        <Typography className="card-text pt-2" variant="h6" color="" align="center">Shipping modes</Typography>
                                        <Chart className="ms-4 me-4 mt-0" chartType="ColumnChart" data={dataColumn} options={optionsColumn} />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                    <Box style={{ backgroundColor: 'white' }} height={300} sx={{ borderRadius: '10px', boxShadow: 2 }}>
                                        <Typography className="card-text pt-2" variant="h6" color="" align="center">Top selling products</Typography>
                                        <TopProducts details={bigger1} qty={biggerQty1} />
                                        <TopProducts details={bigger2} qty={biggerQty2} />
                                        <TopProducts details={bigger3} qty={biggerQty3} />
                                        <TopProducts details={bigger4} qty={biggerQty4} />
                                        <TopProducts details={bigger5} qty={biggerQty5} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid id="rigthCharts" item xs={12} md={12} lg={4}>
                            <Box style={{ backgroundColor: 'white' }} height={590} sx={{ borderRadius: '10px', boxShadow: 2 }}>
                                <Typography className="card-text pt-2 " variant="h6" color="" align="center">Open orders list</Typography>
                                <Chart
                                    chartType="Table"
                                    data={dataTableOpen}
                                    options={optionsTable}
                                    formatters={formattersTable}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div >
    )
};

export default Dash;