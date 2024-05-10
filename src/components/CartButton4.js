import React, { useEffect } from 'react';

function CartButton4() {
  useEffect(() => {
    const scriptId = 'shopify-buy-button-script-4';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.innerHTML = `
        (function () {
          var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
          if (window.ShopifyBuy) {
            if (window.ShopifyBuy.UI) {
              ShopifyBuyInit();
            } else {
              loadScript();
            }
          } else {
            loadScript();
          }
          function loadScript() {
            var script = document.createElement('script');
            script.async = true;
            script.src = scriptURL;
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
            script.onload = ShopifyBuyInit;
          }
          function ShopifyBuyInit() {
            var client = ShopifyBuy.buildClient({
              domain: 'ec386d-2.myshopify.com',
              storefrontAccessToken: 'cf7e35e09c0becda21776c116cf9e69d',
            });
            ShopifyBuy.UI.onReady(client).then(function (ui) {
              ui.createComponent('product', {
                id: '9145285476642',
                node: document.getElementById('product-component-1715341880355'),
                moneyFormat: '%C2%A5%7B%7Bamount_no_decimals%7D%7D',
                options: {
                  "product": {
                    "styles": {
                      "product": {
                        "@media (min-width: 601px)": {
                          "max-width": "calc(25% - 20px)",
                          "margin-left": "20px",
                          "margin-bottom": "50px"
                        }
                      }
                    },
                    "text": {
                      "button": "Add to cart"
                    }
                  },
                  "productSet": {
                    "styles": {
                      "products": {
                        "@media (min-width: 601px)": {
                          "margin-left": "-20px"
                        }
                      }
                    }
                  },
                  "modalProduct": {
                    "contents": {
                      "img": false,
                      "imgWithCarousel": true,
                      "button": false,
                      "buttonWithQuantity": true
                    },
                    "styles": {
                      "product": {
                        "@media (min-width: 601px)": {
                          "max-width": "100%",
                          "margin-left": "0px",
                          "margin-bottom": "0px"
                        }
                      }
                    },
                    "text": {
                      "button": "Add to cart"
                    }
                  },
                  "option": {},
                  "cart": {
                    "text": {
                      "total": "Subtotal",
                      "button": "Checkout",
                      "noteDescription": "特記事項"
                    },
                    "contents": {
                      "note": true
                    }
                  },
                  "toggle": {}
                },
              });
            });
          }
        })();
      `;
      document.body.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return <div id="product-component-1715341880355"></div>;
}

export default CartButton4;