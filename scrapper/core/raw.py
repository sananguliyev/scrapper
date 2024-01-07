# noinspection PyPackageRequirements
from playwright.sync_api import sync_playwright, Error

from scrapper.cache import dump_result
from scrapper.core import (
    new_context,
    close_context,
    page_processing,
)
from scrapper.settings import PARSER_SCRIPTS_DIR


def scrape(request, args, _id):
    with sync_playwright() as playwright:
        context = new_context(playwright, args)
        page = context.new_page()

        page_content = ""
        try:
            # return full source if there is no target selector
            if args.target_selector == "":
                setattr(args, "url", "view-source:" + args.url)
            page_processing(page, args=args)
            parser_args = {
                'targetSelector': args.target_selector,
                'removeSelector': args.remove_selector,
            }
            with open(PARSER_SCRIPTS_DIR / 'raw.js') as fd:
                page_content = page.evaluate(fd.read() % parser_args)
        except Error as error:
            print(error)

        close_context(context)

    # save result to disk
    dump_result(page_content, filename=_id)

    return page_content
