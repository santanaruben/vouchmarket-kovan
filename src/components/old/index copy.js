import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import NewProposal from "./NewProposal.tsx";
import { VM, LogProposal, weiToEth2, zeroAddress } from "../../vm";
import ChainContext from "../../Context/ChainContext";

// import CircularProgress from "@material-ui/core/CircularProgress";
// import Grid from "@material-ui/core/Grid";

import DataTable from "react-data-table-component";

import moment from "moment";
import "moment/locale/es-us";
moment.locale("es-us");

const customStyles = {
  cells: {
    style: {
      paddingLeft: "10px",
      paddingRight: "10px",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default function Proposals() {
  const chain = useContext(ChainContext);
  const classes = useStyles();
  const [proposals, setProposals] = useState();

  useEffect(() => {
    if (!chain) return;
    if (VM.VouchMarket === null) return;
    let allProposals;
    async function fetchData() {
      allProposals = await LogProposal();
      if (allProposals.length > 0) formatProposals(allProposals);
    }
    fetchData();
  }, [chain]);

  const formatProposals = async (_proposals) => {
    console.log(_proposals);
    // const list = _proposals.map((row) => row.args.amount.toString());
    // const list = _proposals.map((item, i) => ({ registro: i+1, ...item }))
    const list = _proposals.map(function (row) {
      return {
        id: row.args.idProposal.toNumber(),
        amount: Number(weiToEth2(row.args.amount)),
        timeLimit: row.args.timeLimit.toNumber(),
        user: row.args.user.toString(),
        voucher: row.args.voucher.toString(),
      };
    });
    setProposals(list);
    console.log(list);
  };

  const columnas = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      center: true,
      minWidth: "30px",
      maxWidth: "70px",
    },
    {
      name: "Amount",
      selector: "amount",
      // format: row => <span title={row.nombreDemanda}>{row.nombreDemanda}</span>,
      sortable: true,
      center: true,
      minWidth: "30px",
      maxWidth: "100px",
    },
    {
      name: "Time Limit",
      selector: "timeLimit",
      format: (row) => moment.unix(row.timeLimit).format("LLLL"),
      sortable: true,
      minWidth: "300px",
      maxWidth: "400px",
      center: true,
    },
    {
      name: "User",
      selector: "user",
      // format: row => <span title={row.nombreDemanda}>{row.nombreDemanda}</span>,
      sortable: true,
      center: true,
      minWidth: "30px",
      maxWidth: "140px",
    },
    {
      name: "Voucher",
      selector: "voucher",
      format: (row) => (row.voucher === zeroAddress ? "Open" : row.voucher),
      sortable: true,
      center: true,
      minWidth: "30px",
      maxWidth: "140px",
    },
  ];

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {proposals ? (
        <>
          <DataTable
            customStyles={customStyles}
            columns={columnas}
            data={proposals}
            defaultSortField="registro"
            defaultSortAsc={false}
            noHeader={true}
            keyField="id"
            highlightOnHover={true}
            pointerOnHover={true}
            striped={true}
            // progressPending={Boolean(proposals)}
            // progressComponent={
            //   <Grid container justify="center" alignItems="center">
            //     <CircularProgress size={30} style={{ position: "absolute" }} />
            //   </Grid>
            // }
            noDataComponent="No hay registros"
            pagination={true}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
            paginationComponentOptions={{
              rowsPerPageText: "Registros por página:",
              rangeSeparatorText: "de",
              noRowsPerPage: false,
              selectAllRowsItem: false,
              selectAllRowsItemText: "Todos",
            }}
            // onRowClicked={this.mostrarDetalles}
            // subHeader
            // subHeaderComponent={
            //   <div style={{marginRight:'6px',fontSize:'12px'}} className="input-group">
            //     <div className="input-group-prepend" title="Nombre Filtro" value={this.state.filtro} onChange={e => this.handleTipoFiltro(e.target.value)}>
            //       <select className="input-group-text" id='tipoFiltro'>
            //         <option value="idDemanda">ID Demanda</option>
            //         <option value="idDemandado">ID Demandado</option>
            //         <option value="nombreDemanda">Nombre Demanda</option>
            //         <option value="estadoDemanda">Estado Demanda</option>
            //       </select>
            //     </div>
            //     <div className="input-group-prepend">
            //       <span className="input-group-text" title="Filtro"><i className="fa fa-filter"></i></span>
            //     </div>
            //     <input type="search" className="form-control" placeholder="Valor a filtrar" value={this.state.content} onChange={e => this.handleChange(e.target.value)} autoFocus/>
            //   </div>
            // }
          />
        </>
      ) : (
        <div>{"Cargando"}</div>
      )}
      <NewProposal />
    </main>
  );
}
