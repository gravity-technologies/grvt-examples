package goverifier_test

import (
	"fmt"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/stretchr/testify/require"
)

var (
	// Create account values
	accountID = common.HexToAddress("0x1a58c9e1cf9ea9d878c5212c6deeb32a8d74de27")
	nonce     = uint32(1906624712)
)

func TestWithPrivateKey(t *testing.T) {
	pk, err := crypto.HexToECDSA("ec16962ad953e803281e6916110d0101a07b88346c595510a2117b131a4475e3")
	require.NoError(t, err)

	// Hash create account payload
	msgHash, err := hashCreateAccount(accountID, nonce)
	require.NoError(t, err)
	t.Log("msgHash      :", msgHash.Hex())

	// Sign the payload hash
	sig, err := Sign(msgHash.Bytes(), pk)
	require.NoError(t, err)
	t.Log("signed", common.Bytes2Hex(sig))

	// Recover address
	signer := crypto.PubkeyToAddress(pk.PublicKey)
	err = VerifySignatureRSV(msgHash.Bytes(), signer, sig[:32], sig[32:64], sig[64])
	require.NoError(t, err)
}

func TestWithDfnsRSV(t *testing.T) {

	// These are returned by Dfns
	r := common.FromHex("0x7f66d3c8587db2f2e7da4db2dc54c7904cf01379d3e96da6178f46850f73c9ab")
	s := common.FromHex("0x0097d77276445027ddd5fdf8bd8c205572400414b9c25bea3498abe77e9b12dc")
	v := uint8(0x1c)

	// Hash create account payload
	msgHash, err := hashCreateAccount(accountID, nonce)
	require.NoError(t, err)
	fmt.Println("msgHash      :", msgHash.Hex())

	// Recover the signer address
	err = VerifySignatureRSV(msgHash.Bytes(), accountID, r, s, v)
	require.NoError(t, err)
}
