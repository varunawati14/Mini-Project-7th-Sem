import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TicketCheckoutcss.css";

export default class MerchCheckout extends Component {
  state = {
    wallet: [],
    ticket_id: this.props.context.ticket_id,
    ticket: {},
    quantity: 1,
  };
  componentDidMount() {
    if (this.props.context.signed_in) {
      axios
        .get("/getWalletInfo", {
          headers: {
            authorization: "Bearer " + this.props.context.user,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.setState({ wallet: res.data });
        });
      axios
        .get("/singleTour", {
          params: { tour_id: this.state.ticket_id },
        })
        .then((res) => {
          // console.log(res.data);
          this.setState({ ticket: res.data[0] });
        });
    }
  }

  decrementQuantity(e) {
    if ((this.state.quantity > 1) & !this.state.redirectToOrders) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  }
  incrementQuantity(e) {
    if (
      (this.state.quantity < this.state.ticket.tours_limit) &
      !this.state.redirectToOrders
    ) {
      this.setState({ quantity: this.state.quantity + 1 });
    }
  }

  handleClick(e) {
    if (!this.state.redirectToOrders) {
      console.log("called /confirmMetch");
      axios
        .post(
          "/checkoutconfirmTicket",
          {
            tour_id: this.state.ticket_id,
            user_email: this.props.context.user,
            quantity: this.state.quantity,
          },
          {
            headers: {
              authorization: "Bearer " + this.props.context.user,
            },
          }
        )
        .then((res) => {
          if (res) {
            if (res.status === 200) {
              this.setState({ redirectToOrders: true });
            } else if (res.status === 500) {
              this.setState({ showError1: true });
            } else {
              this.setState({ showError1: true });
            }
          } else {
            this.setState({ showError1: true });
          }
        });
    } else {
      this.setState({ showError1: true });
    }
  }
  render() {
    // {this.props.context.signed_in}
    // console.log(this.state);
    // console.log("state", this.state);
    let date1 = new Date(this.state.wallet.expiry);
    let date_to_display = date1.toDateString();
    let balance_after_payment =
      this.state.wallet.balance - this.state.ticket.price * this.state.quantity;
    let time = new Date(this.state.ticket.time);
    // let tour_date = time.toDateString();
    if (this.props.context.signed_in) {
      return (
        <div className="checkout-page-main-container">
          <h1 className="checkout-page-h1">Checkout</h1>
          <div className="checkout-page-container">
            <div className="checkout-page-left-wallet-container">
              <h3 className="checkout-page-h3">Your Wallet Details</h3>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>User ID: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{this.state.wallet.user_id}</span>
                </div>
              </div>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>Email: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{this.state.wallet.email}</span>
                </div>
              </div>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>Wallet ID: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{this.state.wallet.wallet_id}</span>
                </div>
              </div>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>Expiry: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{date_to_display.slice(4, 15)}</span>
                </div>
              </div>
            </div>
            <div className="ticket-checkout-page-right-container">
              <div className="ticket-checkout-details">
                <h4 className="ticket-checkout-event-time">
                  Event on : {time.toString()}
                </h4>
                <div className="ticket-details">
                  <img
                    src={require("../images/pass.png")}
                    alt="pass"
                    // style={{
                    //   width: 20,
                    //   background: "#ddd",
                    //   border: "1px solid #888",
                    //   borderRadius: 4,
                    // }}
                    className="order-ticket-img"
                  />
                  <div className="ticket-name">
                    <h3>{this.state.ticket.tour_name}</h3>
                    <h6>{this.state.ticket.location}</h6>
                  </div>
                  <div className="ticket-cart-form__quantity">
                    <div className="ticket-cart-quantity ticket-cart-quantity--large">
                      <span
                        className="ticket-cart-quantity__Button"
                        onClick={(e) => {
                          this.decrementQuantity(e);
                        }}
                      >
                        –
                      </span>
                      <input
                        type="text"
                        className="ticket-cart-quantity__CurrentQuantity"
                        name="cart-quantity"
                        value={this.state.quantity}
                        readOnly
                      />
                      <span
                        className="ticket-cart-quantity__Button"
                        onClick={(e) => {
                          this.incrementQuantity(e);
                        }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                  <span className="ticket-current-price">
                    ₹ {this.state.ticket.price}
                  </span>

                  <span className="ticket-quantity">
                    x {this.state.quantity}
                  </span>
                  <span className="ticket-checkout-price">
                    ₹ {this.state.ticket.price * this.state.quantity}
                  </span>
                </div>
              </div>

              <div className="checkout-page-above-final-price">
                <div>
                  <div className="checkout-page-above-fp-left">
                    <span>Available balance</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>₹ {this.state.wallet.balance}</span>
                  </div>
                </div>
                <div>
                  <div className="checkout-page-above-fp-left">
                    <span>Subtotal</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>
                      ₹ {this.state.ticket.price * this.state.quantity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="checkout-page-below-final-price">
                <div>
                  <div className="checkout-page-above-fp-left">
                    <span>Balance after payment</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>₹ {balance_after_payment.toString()}</span>
                  </div>
                </div>
                {balance_after_payment > 0 ? (
                  !this.state.redirectToOrders ? (
                    <div style={{ float: "right" }}>
                      <button
                        onClick={(e) => this.handleClick(e)}
                        className="checkout-page-confirm-button"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : null
                ) : (
                  <div className="ticket-checkout-page-alert-message">
                    <h4>
                      Sorry! You need to recharge your wallet before you proceed
                    </h4>
                    <Link
                      to="/wallet/addToWallet"
                      className="checkout-page-confirm-button"
                    >
                      Add money to wallet
                    </Link>
                  </div>
                )}
              </div>
              {this.state.showError1 ? (
                <div className="ticket-checkout-page-alert-message">
                  <h4>There was some error!</h4>
                </div>
              ) : null}
              {this.state.redirectToOrders ? (
                <div className="ticket-checkout-page-alert-message">
                  <h4>Order was successfully placed</h4>
                  <Link className="cart-bottom-buttons" to="/orders">
                    Back to orders
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/signin" />;
    }
    // return <Redirect to="/signin" />;
  }
}
