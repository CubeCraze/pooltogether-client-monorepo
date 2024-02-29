import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useFirstDrawOpenedAt,
  useManualContributionEvents,
  usePrizeBackstopEvents,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { formatNumberForDisplay, getSimpleDate, MAX_UINT_256 } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { formatUnits, Log } from 'viem'
import { ReserveCard } from '@components/Reserve/ReserveCard'
import { QUERY_START_BLOCK } from '@constants/config'
import { useReserve } from '@hooks/useReserve'
import { DrawAwardTx, RngAuctionTx, useRngTxs } from '@hooks/useRngTxs'
import { LineChart } from './LineChart'

interface DataPoint {
  name: string
  reserve: number
  liquidations: number
  manual: number
  rewards: number
  prizeBackstops: number
  buyback: number
}

// TODO: `burnToken` should be optional, and all logic within should function appropriately
interface ReserveChartProps {
  prizePool: PrizePool
  burnToken: Token
  className?: string
}

export const ReserveChart = (props: ReserveChartProps) => {
  const { prizePool, burnToken, className } = props

  const { data: reserve } = useReserve(prizePool)

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const { data: manualContributionEvents } = useManualContributionEvents(prizePool, {
    fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  })

  const { data: prizeBackstopEvents } = usePrizeBackstopEvents(prizePool, {
    fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  })

  const { data: firstDrawOpenedAt } = useFirstDrawOpenedAt(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartData = useMemo(() => {
    if (
      !!reserve &&
      !!rngTxs &&
      isFetchedRngTxs &&
      !!firstDrawOpenedAt &&
      !!manualContributionEvents &&
      !!prizeBackstopEvents &&
      !!prizeToken
    ) {
      const data: DataPoint[] = []

      const formatPrizeNum = (val: bigint) => {
        return parseFloat(formatUnits(val, prizeToken.decimals))
      }

      const validRngTxs = rngTxs.filter(
        (txs) => txs.rngAuction.reward !== undefined && !!txs.drawAward
      ) as {
        rngAuction: RngAuctionTx & { reward: bigint }
        drawAward: DrawAwardTx
      }[]

      let minBlock = 0n
      let maxBlock = validRngTxs[0]?.drawAward.blockNumber

      const isValidEvent = (event: Log<bigint, number, false>) => {
        return event.blockNumber >= minBlock && event.blockNumber < maxBlock
      }

      data.push({
        name: `Start-${firstDrawOpenedAt}`,
        reserve: 0,
        liquidations: 0,
        manual: 0,
        rewards: 0,
        prizeBackstops: 0,
        buyback: 0
      })

      validRngTxs.forEach((txs, i) => {
        const drawId = txs.drawAward.drawId
        const awardedAt = txs.drawAward.timestamp
        const name = `${drawId}-${awardedAt}`

        // Inbound tokens
        const manual = formatPrizeNum(
          manualContributionEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
        )

        // Outbound tokens
        const rewards = formatPrizeNum(txs.rngAuction.reward + txs.drawAward.reward)
        const prizeBackstops = formatPrizeNum(
          prizeBackstopEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
        )
        const buyback = formatPrizeNum(txs.drawAward.remainingReserve)

        // Calculated liquidation contributions
        const liquidations = rewards + prizeBackstops + buyback - manual

        data.push({
          name,
          reserve: 0,
          liquidations,
          manual,
          rewards,
          prizeBackstops,
          buyback
        })

        minBlock = maxBlock
        maxBlock = validRngTxs[i + 1]?.drawAward.blockNumber ?? MAX_UINT_256
      })

      const currentPendingReserve = formatPrizeNum(reserve.pending)
      const currentManual = formatPrizeNum(
        manualContributionEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
      )
      const currentLiquidations = currentPendingReserve - currentManual

      data.push({
        name: `Now-${currentTimestamp}`,
        reserve: currentPendingReserve,
        liquidations: currentLiquidations,
        manual: currentManual,
        rewards: 0,
        prizeBackstops: 0,
        buyback: 0
      })

      return data
    }
  }, [reserve, rngTxs, firstDrawOpenedAt, currentTimestamp])

  if (!!chartData?.length && !!prizeToken) {
    return (
      <div className={classNames('w-full flex flex-col gap-2 text-pt-purple-700', className)}>
        <LineChart
          data={chartData}
          lines={[{ id: 'reserve', strokeWidth: 3 }]}
          tooltip={{
            show: true,
            content: ({ active, payload, label }) => {
              if (active && !!payload?.length) {
                return (
                  <ReserveCard
                    {...(payload[0].payload as DataPoint)}
                    name={formatTooltipLabel(label)}
                    prizeToken={prizeToken}
                    burnToken={burnToken}
                  />
                )
              } else {
                return <></>
              }
            }
          }}
          xAxis={{
            interval: 'preserveStart',
            minTickGap: 50,
            tickFormatter: (tick) => formatXAxisDateTick(tick)
          }}
          yAxis={{
            tickFormatter: (tick) => formatNumberForDisplay(tick, { maximumFractionDigits: 0 })
          }}
        />
      </div>
    )
  }

  return <></>
}

const formatTooltipLabel = (label: string) => {
  const [drawId, timestamp] = label.split('-')
  return !isNaN(+drawId) ? `${getSimpleDate(Number(timestamp))} (Draw #${drawId})` : drawId
}

const formatXAxisDateTick = (tick: string | number) => {
  return new Date(Number(String(tick).split('-')[1]) * 1e3).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}
