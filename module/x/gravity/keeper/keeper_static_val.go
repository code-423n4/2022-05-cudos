package keeper

import (
	"sort"

	"github.com/althea-net/cosmos-gravity-bridge/module/x/gravity/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k Keeper) SetStaticValCosmosAddr(ctx sdk.Context, cosmosAddr string) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.GetStaticValCosmosAddrKey(cosmosAddr), []byte(cosmosAddr))
}

func (k Keeper) IterateStaticValCosmosAddr(ctx sdk.Context, cb func(key []byte, cosmosAddr string) bool) {
	prefixStore := prefix.NewStore(ctx.KVStore(k.storeKey), types.StaticValCosmosAddrKey)
	iter := prefixStore.Iterator(nil, nil)
	defer iter.Close()
	for ; iter.Valid(); iter.Next() {
		var cosmosAddr = string(iter.Value())
		if cb(iter.Key(), cosmosAddr) {
			break
		}
	}
}

func (k Keeper) GetStaticValCosmosAddrs(ctx sdk.Context) (out []string) {
	k.IterateStaticValCosmosAddr(ctx, func(_ []byte, cosmosAddr string) bool {
		out = append(out, cosmosAddr)
		return false
	})
	sort.Strings(out)
	return
}

func (k Keeper) GetStaticValOperAddrsAsMap(ctx sdk.Context) map[string]bool {
	m := make(map[string]bool)
	k.IterateStaticValCosmosAddr(ctx, func(_ []byte, cosmosAddr string) bool {
		accAddress, err := sdk.AccAddressFromBech32(cosmosAddr)
		if err == nil {
			valAddress := sdk.ValAddress(accAddress)
			validator, found := k.StakingKeeper.GetValidator(ctx, valAddress)
			if found {
				m[validator.OperatorAddress] = true
			}
		}

		return false
	})
	return m
}

func (k Keeper) IsStaticValByValAddress(ctx sdk.Context, targetValAddress sdk.ValAddress) (result bool) {
	result = false

	k.IterateStaticValCosmosAddr(ctx, func(_ []byte, cosmosAddr string) bool {
		accAddress, err := sdk.AccAddressFromBech32(cosmosAddr)
		if err == nil {
			valAddress := sdk.ValAddress(accAddress)
			if valAddress.String() == targetValAddress.String() {
				result = true
				return true
			}
		}

		return false
	})

	return
}
