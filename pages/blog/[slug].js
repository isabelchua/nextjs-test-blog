import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import marked from "marked";

const Post = ({ htmlString, data }) => {
	return (
		<>
			<Head>
				<title>{data.title}</title>
				<meta title="description" content={data.desciption} />
			</Head>
			<div dangerouslySetInnerHTML={{ __html: htmlString }} />
			{/* <div>
				<div>contents below</div>
				<pre>{contents}</pre>
			</div> */}
		</>
	);
};

export const getStaticPaths = async () => {
	const files = fs.readdirSync("posts");
	console.log("files: ", files);
	const paths = files.map(filename => ({
		params: {
			slug: filename.replace(".md", "")
		}
	}));
	console.log("paths: ", paths);

	return {
		paths,
		fallback: false
	};
};

export const getStaticProps = async ({ params: { slug } }) => {
	// posts/faq.md
	const markdownWithMetadata = fs
		.readFileSync(path.join("posts", slug + ".md"))
		.toString();

	const parsedMarkdown = matter(markdownWithMetadata);

	const htmlString = marked(parsedMarkdown.content);

	return {
		props: {
			// contents: parsedMarkdown.content,
			htmlString,
			data: parsedMarkdown.data
		}
	};
};

export default Post;
