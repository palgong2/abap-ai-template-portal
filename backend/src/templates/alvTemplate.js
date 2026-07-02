function escapeAbapText(value) {
  return String(value || "").replace(/'/g, "''");
}

export function buildSafeAlvReportCode(input) {
  const selectFields = input.fields.join("\n         ");
  const cleanWhereCondition = input.whereCondition.replace(/\.$/, "").trim();

  const whereBlock = cleanWhereCondition
    ? `
    WHERE ${cleanWhereCondition}`
    : "";

  const title = escapeAbapText(input.title);

  return `REPORT ${input.programName}.

*----------------------------------------------------------------------
* Title : ${title}
* Type  : AI Template Based ALV Report
* Table : ${input.tableName}
*----------------------------------------------------------------------
* 이 코드는 AI가 전체를 자유 생성한 코드가 아니라,
* 백엔드의 검증된 ALV 템플릿을 기반으로 생성된 코드입니다.
*----------------------------------------------------------------------

TABLES: ${input.tableName}.

DATA:
  gt_data TYPE STANDARD TABLE OF ${input.tableName},
  go_alv  TYPE REF TO cl_salv_table.

PARAMETERS:
  p_max TYPE i DEFAULT 100.

START-OF-SELECTION.
  PERFORM get_data.
  PERFORM display_alv.

*----------------------------------------------------------------------
* 데이터 조회
*----------------------------------------------------------------------
FORM get_data.

  SELECT ${selectFields}
    FROM ${input.tableName}${whereBlock}
    INTO CORRESPONDING FIELDS OF TABLE gt_data
    UP TO p_max ROWS.

  IF gt_data IS INITIAL.
    MESSAGE '조회 결과가 없습니다.' TYPE 'S' DISPLAY LIKE 'E'.
    RETURN.
  ENDIF.

ENDFORM.

*----------------------------------------------------------------------
* ALV 출력
*----------------------------------------------------------------------
FORM display_alv.

  DATA:
    lo_columns  TYPE REF TO cl_salv_columns_table,
    lo_display  TYPE REF TO cl_salv_display_settings,
    lx_salv_msg TYPE REF TO cx_salv_msg.

  IF gt_data IS INITIAL.
    RETURN.
  ENDIF.

  TRY.
      cl_salv_table=>factory(
        IMPORTING
          r_salv_table = go_alv
        CHANGING
          t_table      = gt_data ).

      lo_columns = go_alv->get_columns( ).
      lo_columns->set_optimize( abap_true ).

      lo_display = go_alv->get_display_settings( ).
      lo_display->set_list_header( '${title}' ).

      go_alv->display( ).

    CATCH cx_salv_msg INTO lx_salv_msg.
      MESSAGE lx_salv_msg->get_text( ) TYPE 'E'.
  ENDTRY.

ENDFORM.
`;
}
