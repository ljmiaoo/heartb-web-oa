"use client";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

import { splitChapter } from "@/app/lib";

export default function Home() {
  /* ----------------------------- get novel list ----------------------------- */
  const { data } = useSWR("/api/novel-list");
  const novels: { key: string; label: string }[] = useMemo(() => {
    return data?.novels?.map((n: string) => ({ key: n, label: n })) ?? [];
  }, [data]);

  /* ----------------------------- select a novel ----------------------------- */
  const [novelId, setNovelId] = useState<string | undefined>();
  const [chapterIndex, setChapterIndex] = useState(0);
  const [novelContent, setNovelContent] = useState<string>("");

  useSWR(novelId ? `/api/novel/${novelId}` : null, null, {
    onSuccess(data) {
      setNovelContent(data);
    },
  });
  const [chapters, setChapters] = useState<ReturnType<typeof splitChapter>>([]);
  const [edited, setEdited] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEdited(false);
    setChapters(splitChapter(novelContent || ""));
  }, [novelContent]);

  const chapter = useMemo(() => {
    return chapters[chapterIndex];
  }, [chapterIndex, chapters]);

  const cursorPositionRef = useRef<number>();

  const triggerUndo = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      document.execCommand("undo", false);
    }
  };

  const insertChapterSplit = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      document.execCommand("insertText", false, "\n---CHAPTER END---\n");
    }
  };

  const splitContent = () => {
    if (!novelId) {
      setNovelContent(textareaRef.current?.value || "");
    } else {
      let newContent = "";

      chapters.forEach((item) => {
        newContent = newContent + item.content;
      });
      setNovelContent(newContent);
    }
  };

  return (
    <section className="flex flex-col h-screen items-center">
      <div className="py-3 px-6 border-b w-full">
        <div className="w-48">
          <Select
            items={novels}
            label="Story"
            placeholder="Select a story"
            value={novelId}
            onChange={(e) => {
              setNovelId(e.target.value);
              setChapterIndex(0);
            }}
          >
            {(story) => <SelectItem key={story.key}>{story.label}</SelectItem>}
          </Select>
        </div>
      </div>
      <div className="w-full px-6 flex flex-row flex-1 min-h-0">
        <div
          className={cn(
            "relative pt-6 flex h-full w-96 max-w-[384px] flex-1 flex-col !border-r-small border-divider pr-6 transition-[transform,opacity,margin] duration-250 ease-in-out",
          )}
          id="menu"
        >
          <header className="flex items-center text-md font-medium text-default-500 group-data-[selected=true]:text-foreground">
            <Icon
              className="text-default-500 mr-2"
              icon="solar:clipboard-text-outline"
              width={24}
            />
            Chapters
          </header>
          <ScrollShadow className="flex-1 -mr-4" id="menu-scroll">
            <div className="flex flex-col gap-4 py-3 pr-4">
              {chapters.length > 0 ? (
                chapters.map((item) => (
                  <Card
                    key={item.key}
                    isPressable
                    className={cn(
                      `max-w-[384px] border-1 border-divider/15`,
                      chapterIndex === item.key && `bg-themeBlue/20`,
                    )}
                    shadow="none"
                    onClick={() => {
                      setChapterIndex(item.key);
                    }}
                  >
                    <CardHeader className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {chapterIndex === item.key && (
                          <Chip
                            className="mr-1 text-themeBlue bg-themeBlue/20"
                            radius="sm"
                            size="sm"
                            variant="flat"
                          >
                            Editing
                          </Chip>
                        )}
                        <p className="text-left mr-1 line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                    </CardHeader>

                    <Divider />
                    <CardBody>
                      <p className="line-clamp-2">{item.pureContent}</p>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-center text-default-400"> -- Empty --</p>
              )}
            </div>
          </ScrollShadow>
        </div>

        <div className="w-full flex-1 flex flex-col pl-6 pt-6">
          <header className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <Button isIconOnly size="sm" variant="light">
                <Icon
                  className="hideTooltip text-default-500"
                  height={24}
                  icon="solar:sidebar-minimalistic-outline"
                  width={24}
                />
              </Button>
              <h4 className="text-md">{chapter?.title}</h4>
            </div>
          </header>
          <div className="w-full flex-1 flex-col flex">
            <div className="flex flex-1 flex-col items-start pb-6">
              <div className="relative w-full min-h-[400px] flex-1 bg-slate-100 dark:bg-gray-800 rounded-lg">
                <div className="absolute inset-x-4 top-4 z-10 flex justify-between items-center">
                  <div className="flex justify-between">
                    <Button
                      className="mr-2 bg-white dark:bg-gray-700"
                      size="sm"
                      startContent={
                        <Icon
                          className="text-default-800"
                          icon="material-symbols:split-scene-up"
                          width={24}
                        />
                      }
                      variant="flat"
                      onClick={insertChapterSplit}
                    >
                      Insert chapter split
                    </Button>
                    {edited && (
                      <Button
                        className="mr-2 bg-white dark:bg-gray-700"
                        size="sm"
                        startContent={
                          <Icon
                            className="text-default-800"
                            icon="material-symbols:undo"
                            width={24}
                          />
                        }
                        variant="flat"
                        onClick={triggerUndo}
                      >
                        Undo
                      </Button>
                    )}
                  </div>

                  <Button
                    className="mr-2 bg-white dark:bg-gray-700"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-800"
                        icon="material-symbols-light:format-strikethrough"
                        width={24}
                      />
                    }
                    variant="flat"
                    onClick={splitContent}
                  >
                    split
                  </Button>
                </div>
                <ScrollShadow className="editScrollShow absolute left-2 right-2 bottom-2 top-12 text-base p-2 resize-none rounded-md border-solid border-inherit">
                  <div className="flex w-full h-full rounded-lg">
                    <textarea
                      ref={textareaRef}
                      className="flex-1 outline-none resize-none rounded-md border border-transparent bg-slate-100 dark:bg-gray-200 text-gray-900"
                      placeholder="-- Empty --"
                      value={chapter?.content}
                      onChange={(e) => {
                        setEdited(true);
                        cursorPositionRef.current = e.target.selectionStart;
                        setChapters((prev) =>
                          prev.map((p, i) =>
                            i === chapterIndex
                              ? { ...p, content: e.target.value }
                              : p,
                          ),
                        );
                      }}
                    />
                  </div>
                </ScrollShadow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
