import { Seo } from '../components/seo/Seo'
import { Membership } from '../sections/Membership'
import { PageShell } from './PageShell'

export function MembershipPage() {
  return (
    <>
      <Seo
        title="Membership | VISIONPLUS LIBRARY Patan"
        description="Enquire about membership at VISIONPLUS LIBRARY in Patan. Plans and prices are published by the library administrator."
        path="/membership"
      />
      <PageShell eyebrow="Membership" title="Study with a plan that fits">
        <Membership />
      </PageShell>
    </>
  )
}
