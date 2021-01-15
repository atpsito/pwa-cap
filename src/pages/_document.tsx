import React from "react";
import Document, { DocumentContext } from "next/document";
import { NextPageContext } from "next";
import { ServerStyleSheet } from "styled-components";

interface Context extends NextPageContext {
  // any modifications to the default context, e.g. query types
  renderPage: (config: { enhanceApp: any }) => void;
}

class MyDocument extends Document {
  static async getInitialProps(
    ctx: Context
  ): Promise<{
    styles: JSX.Element;
    html: string;
    head?: (JSX.Element | null)[] | undefined;
  }> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(
        ctx as DocumentContext
      );
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }
}

export default MyDocument;
