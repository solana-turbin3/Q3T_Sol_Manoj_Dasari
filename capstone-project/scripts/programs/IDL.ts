export type PredictionMarket = {
    "address": "E5kv2j41SfsrZyCeEohk8SQ3i71Yzgiv32ey8ekeL5mQ",
    "metadata": {
      "name": "predictionMarket",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "acceptBet",
        "discriminator": [
          251,
          25,
          85,
          221,
          41,
          69,
          191,
          252
        ],
        "accounts": [
          {
            "name": "opponent",
            "writable": true,
            "signer": true
          },
          {
            "name": "maker"
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "vaultPool",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    95,
                    112,
                    114,
                    111,
                    102,
                    105,
                    108,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "opponent"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "cancelBet",
        "discriminator": [
          17,
          248,
          130,
          128,
          153,
          227,
          231,
          9
        ],
        "accounts": [
          {
            "name": "maker",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "vaultPool",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    95,
                    112,
                    114,
                    111,
                    102,
                    105,
                    108,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "checkWinner",
        "discriminator": [
          246,
          195,
          208,
          54,
          162,
          217,
          84,
          64
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "maker"
          },
          {
            "name": "opponent",
            "docs": [
              "CHECK : BET OPPONENET"
            ]
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "feedInjector"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "checkWinnerDummy",
        "discriminator": [
          97,
          71,
          200,
          106,
          7,
          14,
          39,
          174
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "maker"
          },
          {
            "name": "opponent",
            "docs": [
              "CHECK : BET OPPONENET"
            ]
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "feedInjector"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "claimPrize",
        "discriminator": [
          157,
          233,
          139,
          121,
          246,
          62,
          234,
          235
        ],
        "accounts": [
          {
            "name": "winner",
            "writable": true,
            "signer": true
          },
          {
            "name": "maker"
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "vaultPool",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createBet",
        "discriminator": [
          197,
          42,
          153,
          2,
          59,
          63,
          143,
          246
        ],
        "accounts": [
          {
            "name": "maker",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "vaultPool",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    95,
                    112,
                    114,
                    111,
                    102,
                    105,
                    108,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "maker"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "makerOdds",
            "type": "u64"
          },
          {
            "name": "opponentOdds",
            "type": "u64"
          },
          {
            "name": "pricePrediction",
            "type": "i64"
          },
          {
            "name": "creatorEstimate",
            "type": "bool"
          },
          {
            "name": "deadlineToJoin",
            "type": "i64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "feedInjector",
            "type": "pubkey"
          }
        ]
      },
      {
        "name": "initializeProtocol",
        "discriminator": [
          188,
          233,
          252,
          106,
          134,
          146,
          202,
          91
        ],
        "accounts": [
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "house",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    104,
                    111,
                    117,
                    115,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "admin"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "house"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "fees",
            "type": "i16"
          }
        ]
      },
      {
        "name": "withdrawTreasury",
        "discriminator": [
          40,
          63,
          122,
          158,
          144,
          216,
          83,
          96
        ],
        "accounts": [
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "house",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    104,
                    111,
                    117,
                    115,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "admin"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "house"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "bet",
        "discriminator": [
          147,
          23,
          35,
          59,
          15,
          75,
          155,
          32
        ]
      },
      {
        "name": "house",
        "discriminator": [
          21,
          145,
          94,
          109,
          254,
          199,
          210,
          151
        ]
      },
      {
        "name": "user",
        "discriminator": [
          159,
          117,
          95,
          227,
          239,
          151,
          58,
          236
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "amountNotSufficient",
        "msg": "Deposit amount equal to the odds"
      },
      {
        "code": 6001,
        "name": "invalidOdds",
        "msg": "Invalid Odds"
      },
      {
        "code": 6002,
        "name": "eventAlreadyStarted",
        "msg": "You can't join because event alreday started"
      },
      {
        "code": 6003,
        "name": "eventCantCancel",
        "msg": "Can't cancel event started"
      },
      {
        "code": 6004,
        "name": "unauthorizedAccess",
        "msg": "You can't perform this action"
      },
      {
        "code": 6005,
        "name": "betNotEndedYet",
        "msg": "The bet has not ended yet."
      },
      {
        "code": 6006,
        "name": "betNotResolvedYet",
        "msg": "The bet has not been resolved yet. Please wait until the bet is completed."
      },
      {
        "code": 6007,
        "name": "invalidFeePercentage",
        "msg": "Invalid fee percentage"
      },
      {
        "code": 6008,
        "name": "insufficientFunds",
        "msg": "Insufficient funds in vault"
      },
      {
        "code": 6009,
        "name": "transferFailed",
        "msg": "Failed to transfer funds"
      },
      {
        "code": 6010,
        "name": "invalidBetStatus",
        "msg": "Invalid bet status"
      },
      {
        "code": 6011,
        "name": "priceFeedError",
        "msg": "Price feed error"
      },
      {
        "code": 6012,
        "name": "invalidStartTime",
        "msg": "Invalid start time"
      },
      {
        "code": 6013,
        "name": "invalidEndTime",
        "msg": "Invalid end time"
      },
      {
        "code": 6014,
        "name": "invalidDeadline",
        "msg": "Invalid deadline"
      },
      {
        "code": 6015,
        "name": "betAlreadyResolved",
        "msg": "Bet is already resolved"
      },
      {
        "code": 6016,
        "name": "betNotAccepted",
        "msg": "Bet not accepted"
      },
      {
        "code": 6017,
        "name": "mismatchFeed",
        "msg": "Resolver Feed does not match"
      },
      {
        "code": 6018,
        "name": "noValueFound",
        "msg": "Switchbaord: NoValueFound"
      },
      {
        "code": 6019,
        "name": "noFeedData",
        "msg": "Switchbaord: NoFeedData"
      },
      {
        "code": 6020,
        "name": "priceConversionOverflow",
        "msg": "Switchbaord: PriceConversionOverflow"
      }
    ],
    "types": [
      {
        "name": "bet",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "maker",
              "type": "pubkey"
            },
            {
              "name": "opponent",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "tokenMint",
              "type": "pubkey"
            },
            {
              "name": "odds",
              "type": {
                "defined": {
                  "name": "odds"
                }
              }
            },
            {
              "name": "status",
              "type": {
                "defined": {
                  "name": "betStatus"
                }
              }
            },
            {
              "name": "pricePrediction",
              "type": "i64"
            },
            {
              "name": "creatorEstimate",
              "type": "bool"
            },
            {
              "name": "deadlineToJoin",
              "type": "i64"
            },
            {
              "name": "startTime",
              "type": "i64"
            },
            {
              "name": "endTime",
              "type": "i64"
            },
            {
              "name": "makerDeposit",
              "type": "u64"
            },
            {
              "name": "amountSettled",
              "type": "bool"
            },
            {
              "name": "seed",
              "type": "u64"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "vaultPoolBump",
              "type": "u8"
            },
            {
              "name": "opponentDeposit",
              "type": "u64"
            },
            {
              "name": "winner",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "feedInjector",
              "type": "pubkey"
            }
          ]
        }
      },
      {
        "name": "betStatus",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "findingOpponent"
            },
            {
              "name": "waitingToStart"
            },
            {
              "name": "ongoing"
            },
            {
              "name": "completed"
            }
          ]
        }
      },
      {
        "name": "house",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "pubkey"
            },
            {
              "name": "protoclFees",
              "type": "i16"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "treasuryBump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "odds",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "makerOdds",
              "type": "u64"
            },
            {
              "name": "opponentOdds",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "user",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "totalBets",
              "type": "u64"
            },
            {
              "name": "totalWinnings",
              "type": "u64"
            },
            {
              "name": "totalLosses",
              "type": "u64"
            },
            {
              "name": "totalDraws",
              "type": "u64"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ]
  };
  