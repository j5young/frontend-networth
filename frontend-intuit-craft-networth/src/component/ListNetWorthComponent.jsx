import React, { Component } from 'react'
import AssetDataService from '../service/AssetDataService';
import LiabilityDataService from '../service/LiabilityDataService';
import NetWorthDataService from '../service/NetWorthDataService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NumberFormat from 'react-number-format';

const USER = 'jchan'

class ListNetWorthComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assets: [],
            liabilities: [],
            message: null,
            netWorth: {}
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.refreshAssets = this.refreshAssets.bind(this)
        this.refreshLiabilities = this.refreshLiabilities.bind(this)
        this.refreshNetWorth = this.refreshNetWorth.bind(this)
        this.validate = this.validate.bind(this)
        this.onChangeValueAsset = this.onChangeValueAsset.bind(this)
        this.onChangeValueLiability = this.onChangeValueLiability.bind(this)
        this.deleteAssetClicked = this.deleteAssetClicked.bind(this)
        this.deleteLiabilityClicked = this.deleteLiabilityClicked.bind(this)
    }

    componentDidMount() {
        this.refreshAssets();
        this.refreshLiabilities();
        this.refreshNetWorth();
    }

    refreshAssets() {
        AssetDataService.retrieveAllAssets(USER)
            .then(
                response => {
                    console.log(response);
                    this.setState({ assets: response.data })
                }
            )
    }

    refreshLiabilities() {
        LiabilityDataService.retrieveAllLiabilities(USER)
            .then(
                response => {
                    console.log(response);
                    this.setState({ liabilities: response.data })
                }
            )
    }

    refreshNetWorth() {
        NetWorthDataService.retrieveNetWorth(USER)
            .then(
                response => {
                    console.log(response);
                    this.setState({ netWorth: response.data })
                }
            )
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = 'Enter a Description'
        } if (!values.amount) {
            errors.description = 'Enter an Amount'
        } if (!values.category) {
            errors.description = 'Select a category'
        }else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }  
        return errors
    }

    onChangeValueAsset(values,id) {
        let assetList = this.state.assets.slice();
    
        const newList = assetList.map((item) => {
            if (item.id === id) {
              const updatedItem = {
                ...item,
                amount: values.floatValue,
              };
       
              return updatedItem;
            }
       
            return item;
          });
        this.setState({assets : newList})
        console.log(newList)

        let assetUpdate = {
            id: id,
            amount: values.floatValue
        }
        AssetDataService.updateAsset(assetUpdate,id)
                .then(
                    response => {
                                    this.refreshAssets()
                                    this.refreshNetWorth()
                                }
                    )
    }


    onChangeValueLiability(values,id) {
        let liabilityList = this.state.liabilities.slice();
        const newList = liabilityList.map((item) => {
            if (item.id === id) {
              const updatedItem = {
                ...item,
                amount: values.floatValue
              };
       
              return updatedItem;
            }
       
            return item;
          });
        this.setState({liabilities : newList})
        console.log(newList)

        let liabilityUpdate = {
            id: id,
            amount: values.floatValue
        }
        LiabilityDataService.updateLiability(liabilityUpdate)
                .then(
                    response => {
                                    this.refreshLiabilities()
                                    this.refreshNetWorth()
                                }
                    )
    }


    deleteAssetClicked(id) {
        AssetDataService.deleteAsset(id)
            .then(
                response => {
                    //this.setState({ message: `Delete of asset ${id} Successful` })
                    this.refreshAssets()
                }
            )
    
    }

    deleteLiabilityClicked(id) {
        LiabilityDataService.deleteLiability(id)
            .then(
                response => {
                    //this.setState({ message: `Delete of liability ${id} Successful` })
                    this.refreshLiabilities()
                }
            )
    
    }

    onSubmit(values) {
        console.log(values);
        let liabilityAdd = {
            description: values.description,
            amount: values.amount,
            category: values.category
        }
        LiabilityDataService.addLiability(liabilityAdd)
        .then(
            response => {
                            this.refreshLiabilities()
                            this.refreshNetWorth()
                        }
            )
    }

    render() {
        console.log('render')
        let { description, amount, category } = { description: "", amount: "", category: ""}

                 return ( 
            <div className="container">
                 <div className="container">
                 {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                 <table className="table table-sm">
                 <tbody>
                     <tr><td></td><td>Select Currency: CAD</td><td></td></tr>
                 <tr><td>Net Worth</td>
                    <td><NumberFormat 
                        value={this.state.netWorth.netWorth} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale='2'
                        fixedDecimalScale='true'
                        prefix={'$'} />
                     </td>
                    <td></td></tr>
                 <tr><td><b>Assets</b></td><td></td><td></td></tr>
                 <tr><td><b>Cash and Investments</b></td><td></td><td></td></tr>
                 {this.state.assets.filter(asset => 
                        asset.category === "Cash and Investments").map(
                        filteredAsset =>
                            <tr key={filteredAsset.id}>

                                <td width='60%'>{filteredAsset.description}</td>
                                <td><NumberFormat 
                                defaultValue={filteredAsset.amount} 
                                displayType={'input'} 
                                thousandSeparator={true} 
                                decimalScale='2'
                                fixedDecimalScale='true'
                                allowNegative='false'
                                isNumericString='true'
                                isAllowed={(values) => {const {floatValue} = values;
                                return floatValue <= 1000000000;}}
                                onValueChange={(values) => this.onChangeValueAsset(values,filteredAsset.id)}
                                prefix={'$'} /></td>
                                <td><button
                                type="button" className="btn outline-btn-primary"
                                onClick={() => this.deleteAssetClicked(filteredAsset.id)}
                                >Delete</button>
                                </td>
                            </tr>
                        )
                }

                <tr><td><b>Long Term Assets</b></td><td></td><td></td></tr>
                {this.state.assets.filter(asset => 
                        asset.category === "Long Term Assets").map(
                        filteredAsset =>
                            <tr key={filteredAsset.id}>

                                <td width='60%'>{filteredAsset.description}</td>
                                <td><NumberFormat 
                                defaultValue={filteredAsset.amount} 
                                displayType={'input'} 
                                thousandSeparator={true} 
                                decimalScale='2'
                                fixedDecimalScale='true'
                                allowNegative='false'
                                isNumericString='true'
                                isAllowed={(values) => {const {floatValue} = values;
                                return floatValue <= 1000000000;}}
                                onValueChange={(values) => this.onChangeValueAsset(values,filteredAsset.id)}
                                prefix={'$'} /></td>
                                <td><button
                                type="button" className="btn outline-btn-primary"
                                onClick={() => this.deleteAssetClicked(filteredAsset.id)}
                                >Delete</button>
                                </td>
                            </tr>
                        )
                }
                <tr><td>Total Assets</td>
                <td><NumberFormat 
                        value={this.state.netWorth.totalAssets} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale='2'
                        fixedDecimalScale='true'
                        prefix={'$'} />
                </td><td></td></tr>

                <tr><td><b>Liabilities</b></td><td></td><td></td></tr>
                <tr><td><b>Short Term Liabilities</b></td><td></td><td></td></tr>
                {this.state.liabilities.filter(liability => 
                        liability.category === "Short Term Liabilities").map(
                        filteredLiability =>
                            <tr key={filteredLiability.id}>

                                <td width='60%'>{filteredLiability.description}</td>
                                <td><NumberFormat 
                                defaultValue={filteredLiability.amount} 
                                displayType={'input'} 
                                thousandSeparator={true} 
                                decimalScale='2'
                                fixedDecimalScale='true'
                                allowNegative='false'
                                isNumericString='true'
                                isAllowed={(values) => {const {floatValue} = values;
                                return floatValue <= 1000000000;}}
                                onValueChange={(values) => this.onChangeValueLiability(values,filteredLiability.id)}
                                prefix={'$'} /></td>
                                <td><button
                                type="button" className="btn outline-btn-primary"
                                onClick={() => this.deleteLiabilityClicked(filteredLiability.id)}
                                >Delete</button>
                                </td>
                            </tr>
                        )
                }



            <tr><td><b>Long Term Liabilities</b></td><td></td><td></td></tr>
                {this.state.liabilities.filter(liability => 
                        liability.category === "Long Term Liabilities").map(
                        filteredLiability =>
                            <tr key={filteredLiability.id}>

                                <td width='60%'>{filteredLiability.description}</td>
                                <td><NumberFormat 
                                defaultValue={filteredLiability.amount} 
                                displayType={'input'} 
                                thousandSeparator={true} 
                                decimalScale='2'
                                fixedDecimalScale='true'
                                allowNegative='false'
                                isNumericString='true'
                                isAllowed={(values) => {const {floatValue} = values;
                                return floatValue <= 1000000000;}}
                                onValueChange={(values) => this.onChangeValueLiability(values,filteredLiability.id)}
                                prefix={'$'} /></td>
                                <td><button
                                type="button" className="btn outline-btn-primary"
                                onClick={() => this.deleteLiabilityClicked(filteredLiability.id)}
                                >Delete</button>
                                </td>
                            </tr>
                        )
                }
                <tr><td>Total Liabilities</td>
                <td><NumberFormat 
                        value={this.state.netWorth.totalLiabilities} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale='2'
                        fixedDecimalScale='true'
                        prefix={'$'} />
                </td><td></td></tr>
                </tbody>
                </table>


                <div className="container">
                    <Formik
                        initialValues={{ amount, description, category }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}>
                    <Form>
                        <ErrorMessage name="description" component="div"
                                        className="alert alert-warning" />
                              <Field component="select" className="form-group"
                                name="category"
                                style={{ display: 'block' }}>
                                
                                    <option value="" label="Select a category" />
                                    <option value="Short Term Liabilities" label="Short Term Liabilities" />
                                    <option value="Long Term Liabilities" label="Long Term Liabilities" />
                                </Field>
                        <fieldset className="form-group">
                            <label>Description</label>
                            <Field className="form-control" type="text" name="description" />
                        </fieldset>
                        <fieldset className="form-group">
                            <label>Amount</label>
                            <Field className="form-control" type="number" name="amount" />
                        </fieldset>
                        <button className="btn btn-success" type="submit"
                        >Add</button>
                    </Form>
                    </Formik>
                </div>



            </div> 
        </div>
                                 
        )
    }
}

export default ListNetWorthComponent