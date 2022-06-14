
import React from 'react';
import * as Covalent from './api/Covalent.js';
import * as Unstoppable from './api/Unstoppable.js';
import 'bootstrap-icons/font/bootstrap-icons.scss';

class App extends React.Component {

  /*
    Gestion no result
    Spinner
    Shadow box
    Styling
  */

  constructor(props) {
    super(props);
    this.process = this.process.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.state = { tokenList: [] };
  }

  async process(e) {
    e.preventDefault();

    console.log('getAllChains', await Covalent.getAllChains());

    let domain = document.getElementById('input-search').value;
    let chain = document.getElementById('select-chain').value;

    console.log('process', chain, domain);

    if (!domain) return;

    Unstoppable.getDomainInfo(domain).then(domainInfo => {
      console.log('domainInfo', domainInfo);
      let address = domainInfo.meta.owner;
      console.log('address', address);
      return Covalent.getTokenBalances(chain, address);
    }).then(balances => {
      console.log('balances', balances);
      this.setState({tokenList: balances.data.items });
    }).catch(e => {
      console.error(e);
    })

  }

  onImageError(index) {
    let noLogo = '<i class="bi bi-question-circle" style="font-size: 1.4rem;"></i>';
    document.getElementById('token-logo-' + index).innerHTML = noLogo;
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div className="container">

          <h1 className="my-5">Unstoppable Wallet !</h1>
          
          <form onSubmit={this.process} className="mb-4">
            <div className="mb-3">
              <input type="text" id="input-search" className="form-control form-control-lg" placeholder="Enter an unstoppable domain name" autoComplete="off"/>
            </div>
            <div className="mb-4">
              <label htmlFor="select-chain" className="form-label">Blockchain</label>
              <select id="select-chain" className="form-select" style={{ cursor: 'pointer' }}>
                  <option value="1">Ethereum</option>
                  <option value="56">Binance</option>
                  <option value="137">Polygon </option>
                  <option value="43114">Avalanche</option>
                  <option value="42161">Arbitrum</option>
                  <option value="1284">Moonbeam</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary"><i className="bi bi-search me-2"></i> Show Wallet</button>
          </form>

          <table className="table">
            <tbody>
              { this.state.tokenList.map((token, index) => 
                <tr key={index}>
                  <td id={ 'token-logo-' + index } className="text-center" style={{ width: '2.5rem' }}>
                    <img className="img-fluid" 
                          style={{ width: '1.5rem', height: '1.5rem'  }} 
                          src={ token.logo_url }
                          onError={ () => this.onImageError(index) }
                          alt="" />
                  </td>
                  <td>{ token.contract_ticker_symbol }</td>
                  <td>{ token.contract_name }</td>
                  <td>${ token.quote }</td>
                </tr>
                ) }
            </tbody>
          </table>

      </div>
    );
  }

}

export default App;
