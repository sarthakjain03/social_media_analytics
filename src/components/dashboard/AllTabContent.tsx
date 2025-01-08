import dynamic from 'next/dynamic'

const AccountLinkButtonsWithNoSSR = dynamic( // as I am using 'window' i.e. browser API in these components 
  () => import('@/components/dashboard/AccountLinkButtons'),
  { ssr: false }
)

const AllTabContent = () => {
  return (
    <>
        <AccountLinkButtonsWithNoSSR />
    </>
  )
}

export default AllTabContent