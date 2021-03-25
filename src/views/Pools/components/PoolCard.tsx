import BigNumber from 'bignumber.js'
import React from 'react'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import { getAddress } from 'utils/addressHelpers'
import { PoolCategory } from 'config/constants/types'
import tokens from 'config/constants/tokens'
import { Pool } from 'state/types'

import Card from './Card'
import CardFooter from './CardFooter'
import CardHeader from './CardHeader'
import Apr from './Apr'
import Earned from './Earned'
import Stake from './Stake'

interface HarvestProps {
  pool: Pool
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    harvest,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    apr = null,
  } = pool

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()

  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const isOldSyrup = stakingToken.symbol === tokens.syrup.symbol
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const isCardActive = accountHasStakedBalance
  const earningTokenDecimals = earningToken.decimals
  const earningTokenName = earningToken.symbol
  const poolImage = `${pool.earningToken.symbol}-${pool.stakingToken.symbol}.svg`.toLocaleLowerCase()

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      <CardHeader
        title={`${TranslateString(318, 'Earn')} ${earningTokenName}`}
        coinIconUrl={`/images/pools/${poolImage}`}
        earningTokenName={earningTokenName}
        stakingTokenName={stakingToken.symbol}
        isFinished={isFinished && sousId !== 0}
      />
      <Flex flexDirection="column" padding="24px">
        <Apr tokenName={earningTokenName} isOldSyrup={isOldSyrup} isFinished={isFinished} apy={apr} />
        <Earned
          isFinished={isFinished}
          sousId={sousId}
          earningTokenName={earningToken.symbol}
          stakingTokenName={stakingToken.symbol}
          isBnbPool={isBnbPool}
          harvest={harvest}
          isOldSyrup={isOldSyrup}
          earnings={earnings}
          earningTokenDecimals={earningTokenDecimals}
        />
        <Stake pool={pool} isOldSyrup={isOldSyrup} isBnbPool={isBnbPool} />
      </Flex>
      <CardFooter
        projectLink={earningToken.projectLink}
        stakingDecimals={stakingToken.decimals}
        totalStaked={totalStaked}
        startBlock={startBlock}
        endBlock={endBlock}
        isFinished={isFinished}
        poolCategory={poolCategory}
        earningTokenName={stakingToken.symbol}
        earningTokenAddress={earningToken.address ? getAddress(earningToken.address) : ''}
        earningTokenDecimals={earningTokenDecimals}
      />
    </Card>
  )
}

export default PoolCard
