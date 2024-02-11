
import StudioComponent from '../components/StudioComponent';
import Layout from '../components/shared/Layout';
import PageHeader from '../components/shared/PageHeader';

export default function Ask(props) {


  return (
    <Layout>
      <PageHeader showHeader={true} title={'Ask Jurni'} icon={'ask.svg'} />
      <StudioComponent showPrompts={true} textInputCss='input-container' />

    </Layout>
  );

}
