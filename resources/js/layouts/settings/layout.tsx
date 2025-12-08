import { FlatTabTrigger, FlatTabList, FlatTabs } from '@/components/ui/flat-tabs';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const value = window.location.pathname;

  return (
    <div className="px-6">
      <FlatTabs value={value} className={'mb-6'}>
        <FlatTabList>
          <FlatTabTrigger value={'/settings/profile'}>
            <a href={route('profile.edit')}>
              Profile
            </a>
          </FlatTabTrigger>
          <FlatTabTrigger value={'/settings/password'}>
            <a href={route('password.edit')}>
              Password
            </a>
          </FlatTabTrigger>
          <FlatTabTrigger value={'/settings/appearance'}>
            <a href={route('appearance')}>
              Appearance
            </a>
          </FlatTabTrigger>
          <FlatTabTrigger value={'/settings/billing'}>
            <a href={route('billing')}>
              Billing
            </a>
          </FlatTabTrigger>
          {/*<FlatTabTrigger value={'/settings/api-key'}>*/}
          {/*  <a href={route('api-key')}>*/}
          {/*    API KEY*/}
          {/*  </a>*/}
          {/*</FlatTabTrigger>*/}
        </FlatTabList>
      </FlatTabs>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
