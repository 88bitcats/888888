import { useState } from 'react';
import { Button, Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close, HomeWork, Store } from '@material-ui/icons';
import { updateUserItemOwner } from './../actions/itemActions';
import { connect } from 'react-redux';
import saleContract from './../utils/saleConnection';
import Loader from './Loader';


const useStyles = makeStyles((theme) => ({
  background: {
    height: '100%',
    width: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 20,
  },
  padding: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  buttonSystem: {
    background: `linear-gradient(to right,#6F2F9B, #8D37A9)`,
    borderRadius: '50px',
    lineHeight: '24px',
    fontFamily: 'Balsamiq Sans',
    fontWeight: 400,
    verticalAlign: 'baseline',
    letterSpacing: '0px',
    margin: 0,
    color: '#ffffff',
    padding: '12px 20px 12px 20px',
    fontSize: 18,
    textTransform: 'none',
  },
  buttonMarketplace: {
    borderRadius: '50px',
    background: `linear-gradient(to right,#AF2C59, #C43262)`,
    lineHeight: '24px',
    verticalAlign: 'baseline',
    letterSpacing: '0px',
    margin: 0,
    fontFamily: 'Balsamiq Sans',
    fontWeight: 400,
    color: '#ffffff',
    padding: '12px 20px 12px 20px',
    fontSize: 18,
    textTransform: 'none',
  },

  highlight: {
    color: theme.palette.pbr.primary,
    paddingLeft: 5,
  },

  icon: {
    fontSize: 16,
    marginRight: 7,
    color: '#ffffff',
  },
  messageTitle: {
    paddingTop: 15,
    fontWeight: 400,
    verticalAlign: 'baseline',
    letterSpacing: '-0.8px',
    margin: 0,
    textAlign: 'center',
    color: 'black',
    fontSize: 25,
  },
  title: {
    fontWeight: 400,
    verticalAlign: 'baseline',
    letterSpacing: '-0.8px',
    margin: 0,
    paddingBottom: 10,
    textAlign: 'left',
    color: 'black',
    fontSize: 22,
  },
  subtitle: {
    fontWeight: 400,
    verticalAlign: 'baseline',
    letterSpacing: '-0.8px',
    margin: 0,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: 'left',
    color: ' #757575',

    fontSize: 14,
  },
  para: {
    fontWeight: 400,
    verticalAlign: 'baseline',
    letterSpacing: '-0.8px',
    margin: 0,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'left',
    color: 'white',
    fontSize: 18,
  },
}));
function SellModal({ closePopup, item, updateUserItemOwner, user }) {
  const classes = useStyles();
  const [actualCase, setActualCase] = useState(0);

  const resellToSystem = async () => {
    //Calling Smart Contract
    setActualCase(1);

    let userAddress = user.address;
    const response = await new Promise((resolve, reject) => {
      saleContract.methods
        .resellItemForSystem()
        .send({ from: userAddress }, function (error, transactionHash) {
          if (transactionHash) {
            setActualCase(2);
            resolve(transactionHash);
          } else {
            //console.log('Rejected by user!');
            setActualCase(1);
            reject();
          }
        })
        .on('receipt', async function (receipt) {
          //Now time to update owner details
          console.log('receipt:' + receipt);
          let response = await updateUserItemOwner(item._id);
          console.log(response);
          setActualCase(4);
          window.location.reload();
        })
        .on('error', async function (error) {
          setActualCase(3);
          console.log(error);
        });
    });
    console.log(response);
    return response;






  };
  return (
    <div className={classes.background}>
      <div className="container text-center">
        <div className="d-flex justify-content-between">
          <div className={classes.padding}>
            <h5 className={classes.title}>Sell Your NFT</h5>
          </div>{' '}
          <div style={{ paddingRight: 10, paddingTop: 10 }}>
            <IconButton>
              <Close onClick={closePopup} />
            </IconButton>
          </div>{' '}
        </div>
        <Divider style={{ backgroundColor: 'grey' }} />

        <div className="my-5">
          {actualCase === 0 &&
            (< div className="my-3 d-flex flex-column justify-content-start">
              <div style={{ paddingBottom: 20 }}>
                <Button variant="contained" className={classes.buttonMarketplace}>
                  <Store style={{ marginRight: 10 }} />
                  Sell on Marketplace
                </Button>
              </div>
              <div>
                <Button variant="contained" className={classes.buttonSystem} onClick={resellToSystem}>
                  <HomeWork style={{ marginRight: 10 }} />
                  Resell to the system
                </Button>
              </div>
            </div>)
          }
          {actualCase === 1 &&
            (<div className="text-center my-3">
              <div className="text-center">
                <Loader />
              </div>
              <h5 className={classes.messageTitle}>Waiting for confirmation!</h5>
            </div>)
          }
          {actualCase === 2 &&
            (<div className="text-center my-3">
              <div className="text-center">
                <Loader />
              </div>
              <h5 className={classes.messageTitle}>Transaction submitted, please wait...</h5>
            </div>)
          }
          {actualCase === 3 &&
            (<div className="text-center my-3">
              <img src="https://icon-library.com/images/17c52fbb9e.svg.svg" height="100px" alt='error' />
              <h5 className={classes.messageTitle}>Transaction Failed</h5>
            </div>)
          }
          {actualCase === 4 &&
            (< div className="my-3 d-flex flex-column justify-content-start">
              <div className="text-center my-3">
                <img src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png" height="100px" alt='success' />
              </div>
              <h5 className={classes.messageTitle}>Transaction Success</h5>

            </div>)
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
  user: state.auth.user,
});

const mapDispatchToProps = { updateUserItemOwner };

export default connect(mapStateToProps, mapDispatchToProps)(SellModal);