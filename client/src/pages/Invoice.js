import React, { Fragment, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useEffect } from "react";

const InvoicePage = () => {
  const [invoices, setinvoices] = useState([]);

  const [isAddingnew, setisAddingnew] = useState(false);
  const [isEditing, setisEditing] = useState({
    id: null,
    vis: false,
  });
  const [isProdToggle, setisProdToggle] = useState({
    id: null,
    productIDX: null,
    vis: false,
  });

  const fetchInvoices = async () => {
    const token = localStorage.getItem("token");

    const invoices = await fetch("http://localhost:8080/user/invoices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (invoices.ok) {
      const result = await invoices.json();
      if (result.success) {
        setinvoices(result.invoice);
      } else {
        console.error("Error fetching data:", result.message);
      }
    } else {
      console.error("Error fetching data:", invoices.statusText);
    }
  };

  useEffect(() => {

    fetchInvoices();
  }, []);

  const deleteInvoice = async (invoice) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/user/remove-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(invoice),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        setinvoices(result.invoices);
      } else {
        console.error("Error deleting invoice:", result.message);
      }
    } else {
      console.error("Error deleting invoice:", response.statusText);
    }
  };

  return (
    <div className="bg-zinc-900 h-screen p-5 flex flex-col overflow-hidden">
      <div className="bg-zinc-900 flex flex-col gap-5 p-5">
        <div className="flex justify-between w-full">
          <div className="flex gap-3">
            <h4 className="text-2xl text-white">Invoices</h4>
            <button
              onClick={() => {
                setisAddingnew(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add New
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.setItem("token", "");
                window.location.reload();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-zinc-800 p-5 flex rounded-lg text-white gap-3 flex-wrap">
          {invoices.map((e) => (
            <div className="card">
              {isEditing.vis === true && isEditing.id === e._id ? (
                <ModifyInvoice
                  action={"edit"}
                  setinvoices={setinvoices}
                  invoice={e}
                  setisEditing={setisEditing}
                  fetchInvoices={fetchInvoices}
                />
              ) : (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex-1 overflow-auto scroll-style-1">
                    {e.products.map((ee, ii) => (
                      <div
                        className="mt-2 mr-1 flex bg-zinc-800 flex-col gap-3 rounded-lg px-4 py-3"
                        onClick={() =>
                          setisProdToggle(
                            isProdToggle.vis === true
                              ? {
                                  id: null,
                                  productIDX: null,
                                  vis: false,
                                }
                              : {
                                  id: e._id,
                                  productIDX: ii,
                                  vis: true,
                                }
                          )
                        }
                      >
                        {isProdToggle.vis === true &&
                        isProdToggle.id === e._id &&
                        isProdToggle.productIDX === ii ? (
                          <Fragment>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                Part Type
                              </div>
                              <div className="PartType font-bold mt-1">
                                {ee.PartType}
                              </div>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                Part Description
                              </div>
                              <div className="PartType font-bold mt-1">
                                {ee.PartDescription}
                              </div>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                Product Info
                              </div>
                              <div className="PartType font-bold mt-1">
                                {ee.ProductInfo}
                              </div>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                Color
                              </div>
                              <div className="PartType font-bold mt-1">
                                {ee.Color}
                              </div>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                Quantity
                              </div>
                              <div className="PartType font-bold mt-1">
                                {ee.Quantity}
                              </div>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                PartNumber
                              </div>
                              <div className="PartType font-bold mt-1">
                                {ee.PartNumber}
                              </div>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="PartType font-light text-sm">
                                Price
                              </div>
                              <div className="PartType font-bold mt-1">
                                {""}
                              </div>
                            </div>
                          </Fragment>
                        ) : (
                          <div className="flex justify-between w-full">
                            <div className="PartType font-light text-sm">
                              {ee.PartType}
                            </div>
                            <div className="PartType font-bold">
                              {ee.Quantity}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 justify-between flex bg-zinc-900 rounded-lg px-4 py-3">
                    <div className="PartType">Total</div>
                    <div className="PartType">{e.TotalPrice}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-5 rounded-md py-3 mt-2 bg-red-500 text-white"
                      onClick={() => {
                        deleteInvoice(e);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="px-5 rounded-md flex-1 py-3 mt-2 bg-blue-500 text-white"
                      onClick={() => {
                        setisEditing({ id: e._id, vis: true });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isAddingnew === true && (
            <div className="card">
              <ModifyInvoice
                action={"new"}
                setinvoices={setinvoices}
                setisEditing={setisAddingnew}
                fetchInvoices={fetchInvoices}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModifyInvoice = ({ action, setinvoices, invoice, setisEditing, fetchInvoices }) => {
  const [isAdding, setisAdding] = useState({vis: false, product: null});
  const [addedProd, setaddedProd] = useState([]);

  const [Products, setProducts] = useState({});
  const [selectFieds, setselectFieds] = useState({
    PartType: "",
    PartDescription: "",
    ProductInfo: "",
    Color: "",
    bulk: false,
    Quantity: 0,
    ProductPrice: null,
    SingleP: null,
    BulkP: null,
  });
  const [PartTypeOpt, setPartTypeOpt] = useState([]);
  const [PartDescriptionOpt, setPartDescriptionOpt] = useState([]);
  const [ProductInfo, setProductInfo] = useState([]);
  const [Color, setColor] = useState([]);

  const [addedTotal, setaddedTotal] = useState(0);

  const handleSubmit = async () => {
    console.log("addedProd : ", addedProd);

    //
    const token = localStorage.getItem("token");
    const reqBody = action === "new" ? JSON.stringify({ products: addedProd, TotalPrice: addedTotal }):
     JSON.stringify({ products: addedProd, TotalPrice: addedTotal, invoiceid: invoice._id });
    const response = await fetch( `http://localhost:8080/user/${action === "new" ? "add-invoice" : "edit-invoice"}`, {
      method: action === "new" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: reqBody,
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        fetchInvoices();
        setisEditing(
          action === "edit" ? { id: "", vis: false } : false
        );
      } else {
        console.error("Error fetching data:", result.message);
      }
    } else {
      console.error("Error fetching data:", response.statusText);
    }
  };

  useEffect(() => {
    if (selectFieds.PartType in Products) {
      setPartDescriptionOpt(Object.keys(Products[selectFieds.PartType]));
    }
    if (
      selectFieds.PartType in Products &&
      selectFieds.PartDescription in Products[selectFieds.PartType]
    ) {
      setProductInfo(
        Object.keys(Products[selectFieds.PartType][selectFieds.PartDescription])
      );
    }
    if (
      selectFieds.PartType in Products &&
      selectFieds.PartDescription in Products[selectFieds.PartType] &&
      selectFieds.ProductInfo in
        Products[selectFieds.PartType][selectFieds.PartDescription]
    ) {
      setColor(
        Object.keys(
          Products[selectFieds.PartType][selectFieds.PartDescription][
            selectFieds.ProductInfo
          ]
        )
      );
    }
  }, [selectFieds]);

  useEffect(() => {

    if(action === "edit") {
      setaddedProd(invoice.products);
      setaddedTotal(invoice.TotalPrice);
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/stock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          let PartType = {};
          result.stock.forEach((e) => {
            if (!PartType[e.PartType]) {
              PartType[e.PartType] = {};
            }
            if (!PartType[e.PartType][e.PartDescription]) {
              PartType[e.PartType][e.PartDescription] = {};
            }
            if (!PartType[e.PartType][e.PartDescription][e.ProductInfo]) {
              PartType[e.PartType][e.PartDescription][e.ProductInfo] = {};
            }
            if (
              !PartType[e.PartType][e.PartDescription][e.ProductInfo][e.Color]
            ) {
              PartType[e.PartType][e.PartDescription][e.ProductInfo][e.Color] =
                {};
            }
            PartType[e.PartType][e.PartDescription][e.ProductInfo][e.Color] = {
              Quantity: e.Quantity,
              PartNumber: e.PartNumber,
              SingleP: e.SingleP,
              BulkP: e.BulkP,
            };
          });
          setProducts(PartType);
          setPartTypeOpt(Object.keys(PartType));
        } else {
          console.error("Error fetching data:", result.message);
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }

      const invoices = await fetch("http://localhost:8080/user/invoices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (invoices.ok) {
        const result = await invoices.json();
        if (result.success) {
          setinvoices(result.invoice);
        } else {
          console.error("Error fetching data:", result.message);
        }
      } else {
        console.error("Error fetching data:", invoices.statusText);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = selectFieds;

    let SingleP =
      Products[data.PartType][data.PartDescription][data.ProductInfo][
        data.Color
      ].SingleP;
    let BulkP =
      Products[data.PartType][data.PartDescription][data.ProductInfo][
        data.Color
      ].BulkP;
    let PartNumber =
    Products[data.PartType][data.PartDescription][data.ProductInfo][
      data.Color
    ].PartNumber;
    let ProductPrice =
      data.bulk === true ? BulkP * data.Quantity : SingleP * data.Quantity;
    ProductPrice = parseFloat(ProductPrice.toFixed(2));

    data.ProductPrice = ProductPrice;
    data.SingleP = SingleP;
    data.BulkP = BulkP;
    data.PartNumber = PartNumber;

    console.log(data);
    setselectFieds(data);

    let newaddedProd = [...addedProd];
    if(isAdding.action === "new") {
      let isfoundadded = false;
      addedProd.forEach((e, i) => {
        if (
          e.PartType === data.PartType &&
          e.PartDescription === data.PartDescription &&
          e.ProductInfo === data.ProductInfo &&
          e.Color === data.Color &&
          e.bulk === data.bulk
        ) {
          isfoundadded = true;
          newaddedProd[i].Quantity = action === "edit" ? data.Quantity : newaddedProd[i].Quantity + data.Quantity;
          newaddedProd[i].ProductPrice =
            data.bulk === true
              ? newaddedProd[i].BulkP * newaddedProd[i].Quantity
              : newaddedProd[i].SingleP * newaddedProd[i].Quantity;
        }
      });
      if (!isfoundadded) {
        newaddedProd.push(data);
      }
    } else if(isAdding.action === "edit") {
      newaddedProd[isAdding.product] = data;
    }
    
    setaddedProd(newaddedProd);

    let TotalPrice = newaddedProd.reduce(
      (sum, val) => sum + val.ProductPrice,
      0
    );
    TotalPrice = parseFloat(TotalPrice.toFixed(2));
    setaddedTotal(TotalPrice);

    setisAdding({vis: false, product: null, action: null});

    setselectFieds({
      PartType: "",
      PartDescription: "",
      ProductInfo: "",
      Color: "",
      bulk: false,
      Quantity: 0,
      ProductPrice: null,
      SingleP: null,
      BulkP: null,
    });
  };

  return (
    <Fragment>
      {isAdding.vis === false ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto scroll-style-1">
            {addedProd.map((e, i) => (
              <div className="mt-2 mr-1 justify-between flex bg-zinc-800 rounded-lg px-4 py-3" onClick={() => {
                setselectFieds(e);
                setisAdding({vis: true, product: i, action: "edit"});
              }}>
                <div className="PartType">{e.PartType}</div>
                <div className="PartType">{e.Quantity}</div>
              </div>
            ))}
          </div>

          <div className="mt-2 justify-between flex bg-zinc-900 rounded-lg px-4 py-3">
            <div className="PartType">Total</div>
            <div className="PartType">{addedTotal}</div>
          </div>

          <div className="flex gap-2">
            <button
              className="px-5 rounded-md py-3 mt-2 bg-green-500 text-white"
              onClick={() => {
                setisAdding({vis: true, product: null, action: "new"});
              }}
            >
              Add
            </button>
            <button
              className="px-5 rounded-md flex-1 py-3 mt-2 bg-blue-500 text-white"
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </button>
            <button
              className="px-5 rounded-md py-3 mt-2 bg-zinc-500 text-white"
              onClick={() => {
                setisEditing(
                  action === "edit" ? { id: "", vis: false } : false
                );
              }}
            >
              Cancle
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddProduct} className="flex flex-col">
          <select
            className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
            name="PartType"
            onChange={(e) => {
              setselectFieds({
                ...selectFieds,
                PartType: e.target.value,
              });
            }}
            value={selectFieds.PartType}
            required
          >
            <option value="" selected>
              Select Part Type
            </option>
            {PartTypeOpt.map((e) => (
              <option value={e}>{e}</option>
            ))}
            Details
          </select>
          <select
            className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
            name="PartDescription"
            onChange={(e) => {
              setselectFieds({
                ...selectFieds,
                PartDescription: e.target.value,
              });
            }}
            value={selectFieds.PartDescription}
            required
          >
            <option value="">Select Part Description</option>
            {PartDescriptionOpt.map((e) => (
              <option value={e}>{e}</option>
            ))}
          </select>
          <select
            className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
            name="ProductInfo"
            onChange={(e) => {
              setselectFieds({
                ...selectFieds,
                ProductInfo: e.target.value,
              });
            }}
            value={selectFieds.ProductInfo}
            required
          >
            <option value="">Select Part Info</option>
            {ProductInfo.map((e) => (
              <option value={e}>{e}</option>
            ))}
          </select>
          <select
            className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
            name="Color"
            onChange={(e) => {
              setselectFieds({
                ...selectFieds,
                Color: e.target.value,
              });
            }}
            value={selectFieds.Color}
            required
          >
            <option value="">Select Color</option>
            {Color.map((e) => (
              <option value={e}>{e}</option>
            ))}
          </select>
          <div className="mb-3 flex justify-center">
            <input
              type="checkbox"
              name="isBulk"
              onChange={(e) => {
                setselectFieds({
                  ...selectFieds,
                  bulk: e.target.checked,
                });
              }}
              checked={selectFieds.bulk}
            />
            <div className="ml-2">Bulk (each of 10)</div>
          </div>
          <div class="flex items-center gap-2 justify-center">
            <div
              class="px-2 py-1 bg-zinc-900 flex rounded-md items-center justify-center text-white text-xl"
              onClick={(e) => {
                setselectFieds({
                  ...selectFieds,
                  Quantity:
                    parseInt(selectFieds.Quantity) > 0
                      ? parseInt(selectFieds.Quantity) - 1
                      : 0,
                });
              }}
            >
              -
            </div>
            <input
              name="Quantity"
              class="px-2 py-1 rounded-md bg-white text-black"
              style={{width: "50px", textAlign: "center"}}
              value={selectFieds.Quantity}
              disabled={true}
            ></input>
            <div
              class="px-2 py-1 bg-zinc-900 flex rounded-md items-center justify-center text-white text-xl"
              onClick={(e) => {
                setselectFieds({
                  ...selectFieds,
                  Quantity: parseInt(selectFieds.Quantity) + 1,
                });
              }}
            >
              +
            </div>
          </div>
          <input
            className="px-5 rounded-full py-3 mt-2 bg-blue-500 text-white"
            type="submit"
            value="Add"
          ></input>
        </form>
      )}
    </Fragment>
  );
};

export default InvoicePage;
