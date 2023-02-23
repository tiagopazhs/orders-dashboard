import logoIs from "../assets/LogoIS.png";
import logoMRV from "../assets/logo-mrv.png";
import search from "../assets/search.png";
import option from "../assets/option.png";
import landscape from "../assets/landscape.png";
import barCode from "../assets/barcode.png";
import stagePrinterImg from "../assets/computerPrinter.png";
import stagePrinter from "../assets/stagePrinter.png";
import stagePencil from "../assets/stagePencil.png";
import stageTrash from "../assets/stageTrash.png";
import setaLeft from "../assets/seta-esquerda.png";
import barCodeHistory from "../assets/barcodeWhite.png";
import { Chart } from "react-google-charts";
import { optionsColumn, optionsTable, formattersTable } from "../constants/dashContants";
import React, { useState, useRef } from 'react';
import '../styles.css';
import Select from 'react-select';
import NavBar from "../components/NavBar";
const url = "http://localhost:8500";
let date = new Date();
let day = ("00" + date.getDate()).slice(-2);
let month = ("00" + (date.getMonth() + 1)).slice(-2);
let year = date.getFullYear();
let hour = ("00" + date.getHours()).slice(-2);
let minute = ("00" + date.getMinutes()).slice(-2);
let second = ("00" + date.getSeconds()).slice(-2);
let currentData = `${day}/${month}/${year}`;
let currentTime = `${hour}:${minute}:${second}`;

function Reader() {

    const [dataTableOpen, setDataTableOpen] = useState([["Código produto", "Descrição", "Quantidade"], ["020076-2", "Tshirt Feminina Verão Fazer Diferente Branca M", "1"]   ,["020077-2", "Tshirt Feminina Verão Fazer Diferente Preta M", "1"]   ,["CHVIB03", "Chinelo Havaianas Verão 2022 - Ícones Branco 37/38", "2"]   ,["020111-8", "Pantufa InterPig G", "1"]   ,["71179000", "Chaveiro Inter + Interpig", "1"]   ,["30015", "Caderno Interpig Executivo Preto", "5"]   ,["30012", "Kit Bloquinhos #Sanguelaranja - 4 unidades Kit 4 Bloquinhos #Sanguelaranja", "1"], ["020076-2", "Tshirt Feminina Verão Fazer Diferente Branca GG", "1"] , ["020076-2", "Tshirt Feminina Verão Fazer Diferente preta M", "1"]     ]);
    const [currentOrders, setCurrentOrders] = useState([]);
    const [ordersToVerify, setOrdersToVerify] = useState([]);

    // Requisição get
    async function getPedido(id) {
        const responseGet = await fetch(`${url}/serial`);
        const dadosPedido = await responseGet.json();

        setCurrentOrders(dadosPedido)
        return dadosPedido
    }


    function refreshValues() {
        // table of open orders
        setOrdersToVerify(Array.isArray(currentOrders) ? currentOrders : [])
        let dataTable = [["Pedido", "Produto", "Código de barras", "Número de série"]]
        let dataTableResult = []
        let aux = 0
        let dataTableAdd = []
        while (aux < ordersToVerify.length) {
            dataTableResult = []
            dataTableAdd = ordersToVerify[aux]
            dataTableResult = [...dataTable, [...dataTableAdd]]
            dataTable = dataTableResult
            aux++
            console.log('oi', ordersToVerify[aux])
        }
        console.log('dataTable', dataTable)
        setDataTableOpen(dataTable.length > 2 ? dataTable : [["N order", "Store", "Customer", "Date", "Overdue days"], ["", "", "", "", ""]])
    }

    // Data that will be used in dropdown list.
    const data = [
        {
            value: 1,
            text: <p className="companyName">MRV STORE</p>,
            icon: <div className="logoCompany"><img id="isIcon" src={logoMRV} alt="icone da empresa pesquisada" /></div>,
        },
        {
            value: 2,
            text: <p className="companyName">INTER STORE</p>,
            icon: <div className="logoCompany"><img id="isIcon" src={logoIs} alt="icone da empresa pesquisada" /></div>,
        },
    ];

    // Set variable that will be used in dropdown list. *Default value is one of the items
    const [selectedOption, setSelectedOption] = useState(data[1]);

    // handle onChange event of the dropdown
    const handleChange = e => {
        setSelectedOption(e);
    };

    // Set variables that will be used to comunicate with API
    const [registered, setRegistered] = useState('');
    const [methodReq, setMethodReq] = useState("POST");

    // Set variables that will be used in input fields
    const [codePrinter, setCodePrinter] = useState('');
    const [descOnePrinter, setDescOnePrinter] = useState('');
    const [descTwoPrinter, setDescTwoPrinter] = useState('');

    // Set variables that will be used in ref to move in fields
    const firstInput = useRef(null);
    const secondInput = useRef(null);
    const thirdInput = useRef(null);

    //Set variable of barcode in stage
    const [inStage, setInStage] = useState(landscape);
    const [qtyLabel, setQtyLabel] = useState('0,00');
    const [firstHistoryLabel, setFirstHistoryLabel] = useState('100068');
    const [inStagePrinter, setInStagePrinter] = useState('notInStage');

    //Set variable of barcode in insert
    const [codeInInsert, setCodeInInsert] = useState('');
    const [descTopInInsert, setDescTopInInsert] = useState('');
    const [descBottomInInsert, setDescBottomInInsert] = useState('');

    // Move from input one to input two and call the preview bar
    const moveToSecondInput = (event) => {
        if (event.key === 'Enter') {
            // previewBar();
            secondInput.current.focus();
        }
    }

    // Move from input two to input three
    const moveToThirdInput = (event) => {
        if (event.key === 'Enter') {
            thirdInput.current.focus();
        }
    }

    // Call the stage of user data same in the button insert
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            stageOfValidation()
        }
    }



    // Change the preview img from landscape to a real barCode
    async function previewBar() {
        if (codePrinter === '') {
            setInStage(landscape);
            setQtyLabel('0,00');
            setFirstHistoryLabel('100068');
        } else {
            setInStage(barCode);
            setQtyLabel('3,00');
            setFirstHistoryLabel(codePrinter);
            getProduto();
        }
    };

    // Change the printer img from printer to a Stage of user data validation in screen.
    async function stageOfValidation() {
        if (setCodePrinter === '') {
            setInStagePrinter('notInStage');
        } else {
            setInStagePrinter('inStage');
            setCodeInInsert(codePrinter);
            setDescTopInInsert(descOnePrinter);
            setDescBottomInInsert(descTwoPrinter);
        }
    };

    // Get requisition and return data label printed before
    async function getProduto() {
        const responseGet = await fetch(`${url}/serial/${codePrinter}`);
        const labelData = await responseGet.json();



        if (labelData === null) {
            setRegistered('')
        }
        else {
            setRegistered('got')
            console.log(labelData)
            setDescOnePrinter(labelData.ean)
            setDescTwoPrinter(labelData.serial)
            setMethodReq("PUT")
        }
        return labelData
    }

    // Post requisition and call execute the printer procces in the backEnd
    async function postTrigger(url, type, data) {

        if (type === "POST") {
            return (
                //save data in the historic of label
                fetch(`http://localhost:8500/historic`, {
                    method: "POST",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        "usuario": "defaultUser",
                        "data": currentData,
                        "horario": currentTime,
                        "quantidade": 3,
                        "campoCod": codePrinter,
                        "campoDesc1": descOnePrinter,
                        "campoDesc2": descTwoPrinter
                    })
                })
                    .then(res => {
                        if (res.ok) { console.log("HTTP request successful", data) }
                        else { console.log("HTTP request unsuccessful") }
                        return res
                    })
                    .then(res => res.json())
                    .then(data => data)
                    .catch(error => error),
                //edit data in procces label
                fetch(url, {
                    method: type,
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        if (res.ok) { console.log("HTTP request successful", data) }
                        else { console.log("HTTP request unsuccessful") }
                        return res
                    })
                    .then(res => res.json())
                    .then(data => data)
                    .catch(error => error)
            )
        }

        if (type === "PUT") {
            return (
                //save data in the historic of label
                fetch(`http://localhost:8500/historic`, {
                    method: "POST",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        "usuario": "defaultUser",
                        "data": currentData,
                        "horario": currentTime,
                        "quantidade": 3,
                        "campoCod": codePrinter,
                        "campoDesc1": descOnePrinter,
                        "campoDesc2": descTwoPrinter
                    })
                })
                    .then(res => {
                        if (res.ok) { console.log("HTTP request successful", data) }
                        else { console.log("HTTP request unsuccessful") }
                        return res
                    })
                    .then(res => res.json())
                    .then(data => data)
                    .catch(error => error),
                //edit data in procces label
                fetch(`${url}/:${codePrinter}`, {
                    method: type,
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        if (res.ok) { console.log("HTTP request successful", data) }
                        else { console.log("HTTP request unsuccessful") }
                        return res
                    })
                    .then(res => res.json())
                    .then(data => data)
                    .catch(error => error)
            )
        }
    }

    // clean the input field's to reset the validation of data
    async function cleanFields() {
        setCodePrinter('');
        setDescOnePrinter('');
        setDescTwoPrinter('');
        setInStagePrinter('notInStage');
        setCodePrinter('');
        setInStage(landscape);
        setQtyLabel('0,00');
        setFirstHistoryLabel('100068');
        firstInput.current.focus();
        setMethodReq("POST");
    }

    return (
        <div className="printerPage">
            <NavBar />

            <div className="body">
                <div className="mainPrinter" style={{ boxShadow: '1px 1px 9px #CCCDCD', width: "100%" }}>

                    <div className="navBarPrinter" >
                        <h2 className="ps-5 pt-2" style={{ fontStyle: 'sora', width: "50%", color: '#f3f3f3' }} >Ordem de validação por código de barras</h2>
                        <div className="navBarActions" >
                            <input id="searchLabels" defaultValue={'Buscar no histórico de leitura'}></input>
                            <div className="divSearchIcon">
                                <img id="searchIcon" onClick={() => getPedido()} src={search} alt="icone pesquisar" style={{ backgroundColor: 'white' }} />
                            </div>

                            <img id="optionIcon" src={option} alt="icone de opções" />
                        </div>
                    </div>

                    <div className="midLane">
                        <div className="stageInput" style={{ width: "30%" }}>
                            <div className="stageInputLeft" style={{ width: "100%" }}>
                                <div className="divInput  pt-5 m-3 mt-5" id="box1">
                                    <p>Código de barras</p>
                                    <input className="inputTyped p-0 m-0"
                                        id="input1"
                                        ref={firstInput} //referenciate a fiels for focus use
                                        value={codePrinter}
                                        style={{ height: "50px"}}
                                        onChange={e => setCodePrinter(e.target.value)} //save the type data in a variable
                                        maxLength="14"
                                        onKeyDown={moveToSecondInput} //event executed when press enter
                                    />
                                </div>
                                <div className="pb-5 mb-5">
                                    <button className="pt-0 mt-0" // clean input fields
                                        id="btnEnter"
                                        onClick={() => cleanFields()}
                                        style={{ height: "80px", backgroundColor: '#FB6551', borderColor: '#FB6551' }}
                                    >EXCLUIR
                                    </button>
                                    <button // Call the post function. parameters: url that server is running, requisition type, data to post & clean input fields
                                        className="pt-0 mt-0"
                                        id="btnEnter"
                                        style={{ height: "80px", backgroundColor: '#00C75B', borderColor: '#00C75B' }}
                                    >ADICIONAR
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className="stagePrinter" style={{ width: '70%', alignItems: "center", justifyContent: "" }}>
                            <div className="d-flex" >
                            <Chart
                                chartType="Table"
                                data={dataTableOpen}
                                options={optionsTable}
                                formatters={formattersTable}

                            />
                            </div>
                        </div>

                    </div>

                    <div className="footerBarPrinter" style={{ boxShadow: '0px 0px 6px rgba(73, 87, 105, .24' }}>
                        <div className="sliceFooterPrinter" >

                        </div>
                        <div className="sliceFooterPrinter" id="sliceFooterRigth" >
                            <button // clean input fields
                                id="btnEnter"
                                onClick={() => cleanFields()}
                            >Exportar CSV
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Reader;