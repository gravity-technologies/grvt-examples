package goverifier_test

import (
	"crypto/ecdsa"
	"errors"
	"fmt"
	"strconv"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/common/math"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/signer/core/apitypes"
	"github.com/storyicon/sigverify"
)

var (
	createAccountDataType = apitypes.TypedData{
		PrimaryType: "CreateAccount",
		Domain: apitypes.TypedDataDomain{
			Name:    "GRVT Exchange",
			Version: "0",
			ChainId: math.NewHexOrDecimal256(1),
		},
		Types: apitypes.Types{
			"EIP712Domain": []apitypes.Type{
				{Name: "name", Type: "string"},
				{Name: "version", Type: "string"},
				{Name: "chainId", Type: "uint256"},
			},
			"CreateAccount": []apitypes.Type{
				{Name: "accountID", Type: "address"},
				{Name: "nonce", Type: "uint32"},
			},
		},
	}
)

func hashCreateAccount(accountID common.Address, nonce uint32) (common.Hash, error) {
	return hash(createAccountDataType, apitypes.TypedDataMessage{
		"accountID": accountID.Hex(),
		"nonce":     strconv.FormatUint(uint64(nonce), 10),
	})
}

func hash(dataType apitypes.TypedData, message apitypes.TypedDataMessage) (common.Hash, error) {
	payload := apitypes.TypedData{
		Types:       dataType.Types,
		PrimaryType: dataType.PrimaryType,
		Domain:      dataType.Domain,
		Message:     message,
	}
	hash, _, err := apitypes.TypedDataAndHash(payload)
	if err != nil {
		return common.Hash{}, err
	}
	return common.BytesToHash(hash), nil
}

// VerifySignatureRSV verifies the signature of the given data using the RSV (r, s, v) parameters.
// If the signature verification is successful, it returns true and nil error; otherwise, it returns false and an error indicating the reason.
//
// Parameters:
//   - data: The data or message that was signed.
//   - address: The expected address of the signer.
//   - r: The R component of the signature, representing the x-coordinate of a point on the elliptic curve.
//   - s: The S component of the signature, representing a scalar value derived from the private key and the message.
//   - v: The V component of the signature, indicating the recovery id or chain identifier.
//
// Returns:
//   - bool: True if the signature is valid and matches the signer's address, false otherwise.
//   - error: An error indicating the reason for the signature verification failure, or nil if verification is successful.
func VerifySignatureRSV(data []byte, address common.Address, r []byte, s []byte, v uint8) error {
	if len(r) > 32 || len(s) > 32 || v != 27 && v != 28 {
		return errors.New("invalid signature length or v value")
	}
	sig := make([]byte, 65)
	copy(sig[32-len(r):32], r) // if len(r) < 32, pad with zeros
	copy(sig[64-len(s):64], s) // if len(s) < 32, pad with zeros
	sig[64] = v
	recovered, err := sigverify.RecoveryAddressEx(data, sig)
	if err != nil {
		return err
	}
	fmt.Println("RecoveredAddr:", recovered.Hex())
	fmt.Println("ExpectedAddr :", address.Hex())
	if recovered != address {
		// This has to be "recovery failed". The `RecoveryAddressEx` function is flaky.
		// Sometimes it returns an error, sometimes it returns the wrong address.
		return fmt.Errorf("recovered address does not match expected address")
	}
	return nil
}

func SignRSV(hash []byte, privateKey *ecdsa.PrivateKey) (r []byte, s []byte, v byte, err error) {
	sig, err := Sign(hash, privateKey)
	if err != nil {
		return nil, nil, 0, err
	}

	return sig[:32], sig[32:64], sig[64], nil
}

func Sign(hash hexutil.Bytes, privateKey *ecdsa.PrivateKey) (sig []byte, err error) {
	sig, err = crypto.Sign(hash, privateKey)
	if err != nil {
		return nil, err
	}
	if sig[64] < 27 {
		sig[64] += 27
	}
	return sig, nil
}
