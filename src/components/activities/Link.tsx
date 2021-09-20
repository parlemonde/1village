import Link from 'next/link';
import { primaryColor } from 'src/styles/variables.const';

interface LinkProps {
    url: string;
  }

const ActivityLink = ({ url }: LinkProps) => {
    return (
        <div style={{ margin: '1rem 0' }}>
            Votre énigme initie un nouvel échange avec les Pélicopains, si vous souhaitez plutôt réagir à une activité déjà publiée,{' '}
            <Link href={url}>
              <a style={{color: primaryColor}} href={url}>
                 cliquez ici.
              </a>
            </Link>
        </div>
    )};

export default ActivityLink;