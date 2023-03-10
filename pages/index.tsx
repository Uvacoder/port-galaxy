import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { GitHub, Key, Twitter } from 'react-feather';
import { Mastodon, Tumblr } from '@icons-pack/react-simple-icons';
import dayjs from 'dayjs';

import { DiscordPresence } from 'components/presence';
import { GitHubSection, ToolsSection } from 'components/section';
import { Header, Paragraph, SubHeader } from 'components/text';

import { BIRTHDAY, GITHUB_USERNAME } from 'lib/constants';
import { isDate } from 'lib/time';
import { GitHubPinnedRepo, useGitHubPinnedRepos } from 'lib/hooks';

interface Props {
	pinnedRepos: (GitHubPinnedRepo & { url: string })[];
}

export default function Home(props: Props) {
	const socials = [
		{
			link: 'https://github.com/iGalaxyYT',
			icon: GitHub,
		},
		{
			link: 'https://twitter.com/_iGalaxyYT',
			icon: Twitter,
		},
		{
			link: 'https://mastodon.lol/@igalaxy',
			icon: Mastodon,
		},
		{
			link: 'https://keybase.io/igalaxy',
			icon: Key,
		},
	];

	const [isBirthday, setIsBirthday] = useState(isDate(BIRTHDAY));

	const [intervalCheck, setIntervalCheck] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setIsBirthday(isDate(BIRTHDAY));

			setIntervalCheck(intervalCheck + 1);
		}, 100);

		return () => clearInterval(interval);
	}, [intervalCheck]);

	const { data: github = props.pinnedRepos } =
		useGitHubPinnedRepos(GITHUB_USERNAME);

	return (
		<div>
			<div
				style={{
					marginBottom: '18px',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				{socials.map((social, i) => (
					<Link href={social.link} passHref key={`social${i}`}>
						<a target="_blank" style={{ paddingRight: '10px' }}>
							<social.icon width={28} height={28} className={'socialIcon'} />
						</a>
					</Link>
				))}
				<DiscordPresence id={'182292736790102017'} />
			</div>
			<Header>Hey, I&lsquo;m iGalaxy {isBirthday ? '🥳' : '👋'}</Header>
			<Paragraph style={{ marginTop: '18px' }}>
				I&lsquo;m a <Age birthdate={BIRTHDAY} />
				-year-old aspiring software engineer & Minecraft enthusiast.
			</Paragraph>
			<Paragraph style={{ marginTop: '18px' }}>
				I&lsquo;m pursuing full-stack web development using modern technologies
				and I&lsquo;m creating multiplayer experiences for Minecraft: Java
				Edition.
			</Paragraph>
			<br />
			<SubHeader>What am I building? 🚀</SubHeader>
			<Paragraph style={{ marginTop: '18px' }}>
				I&lsquo;m currently juggling a lot of projects, but here is a selection
				of some of my favorite open source projects I&lsquo;ve worked on.
			</Paragraph>
			<br />
			<GitHubSection pinnedRepos={github!} />
			<br />
			<SubHeader>What am I using? 🛠️</SubHeader>
			<Paragraph style={{ marginTop: '18px' }}>
				I&lsquo;m always trying to learn something new, and while I&lsquo;ve
				traditionally focused on high-level web development, nowadays I&lsquo;m
				branching out and exploring other languages such as Go.
			</Paragraph>
			<br />
			<ToolsSection />
		</div>
	);
}

const Age = ({ birthdate }: { birthdate: string }) => {
	const [clicked, setClicked] = useState(false);

	const [year, setYear] = useState(dayjs().diff(birthdate, 'year'));

	const [intervalCheck, setIntervalCheck] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setYear(dayjs().diff(birthdate, 'year', true));

			setIntervalCheck(intervalCheck + 1);
		}, 100);

		return () => clearInterval(interval);
	}, [birthdate, intervalCheck]);

	return (
		<span onClick={() => setClicked(!clicked)} className={'clickable'}>
			{clicked ? `~${year.toFixed(8)}` : Math.floor(year)}
		</span>
	);
};

export const getStaticProps: GetStaticProps<Props> = async function () {
	const pinnedRepos = await fetch(
		`https://gh-pinned-repos.egoist.dev/?username=${GITHUB_USERNAME}`
	).then(async response => response.json() as Promise<GitHubPinnedRepo[]>);

	return {
		props: {
			pinnedRepos: pinnedRepos.map(repo => ({
				...repo,
				url: `https://github.com/${repo.owner}/${repo.repo}`,
			})),
		},
	};
};
